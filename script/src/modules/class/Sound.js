export default class Sound {
	constructor() {
		this.ctx = new AudioContext();
		this.source = null;
	}

	// async load(audioPath) {
	// 	// オーディオファイルをロードする
	// 	let res = await fetch(audioPath);
	// 	// ロード完了したレスポンスから、AudioBuffer生成のためのデータを取り出す
	// 	let buffer = await res.arrayBuffer();
	// 	// AudioBuffer生成
	// 	let decodeAudio = await this.ctx.decodeAudioData(buffer);

	// 	if (decodeAudio != null) {
	// 		// 再利用するために、変数に保持
	// 		this.source = decodeAudio;
	// 		return;
	// 	} else {
	// 		throw new Error('sound読み込みエラー');
	// 	}
	// }
	load(audioPath, callback){
        // fetch を利用してオーディオファイルをロードする
        fetch(audioPath)
        .then((response) => {
            // ロード完了したレスポンスから AudioBuffer 生成のためのデータを取り出す
            return response.arrayBuffer();
        })
        .then((buffer) => {
            // 取り出したデータから AudioBuffer を生成する
            return this.ctx.decodeAudioData(buffer);
        })
        .then((decodeAudio) => {
            // 再利用できるようにするために AudioBuffer をプロパティに確保しておく
            this.source = decodeAudio;
            // 準備完了したのでコールバック関数を呼び出す
            callback();
        })
        .catch(() => {
            // なにかしらのエラーが発生した場合
            callback('error!');
        });
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
