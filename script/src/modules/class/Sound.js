export default class Sound {
	constructor() {
		this.ctx = new AudioContext();
		this.source = null;
	}

	async load(audioPath) {
		// オーディオファイルをロードする
		let res = await fetch(audioPath);
		// ロード完了したレスポンスから、AudioBuffer生成のためのデータを取り出す
		let buffer = await res.arrayBuffer();
		// AudioBuffer生成
		let decodeAudio = await this.ctx.decodeAudioData(buffer);

		if (decodeAudio != null) {
			// 再利用するために、変数に保持
			this.source = decodeAudio;
			return;
		} else {
			throw new Error('sound読み込みエラー');
		}
	}

	play() {
		let node = new AudioBufferSourceNode(this.ctx, { buffer: this.source });
		node.connect(this.ctx.destination);
		node.addEventListener('ended', () => {
			node.stop(); // 念のためstop実行
			node.disconnect();

			// ノードをガベージコレクタが解放するようにnullをバインド
			node = null;
		});
		node.start();
	}
}
