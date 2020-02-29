export default class SceneManager {
	constructor() {
		this.scene = {};
		this.activeScene = null;
		this.startTime = null;

		// 現在のシーンがアクティブになってからのフレーム
		this.frame = null;
	}

	add(name, updateFunction) {
		this.scene[name] = updateFunction;
	}

	use(name) {
		if (this.scene.hasOwnProperty(name) !== true) {
			return;
		}

		this.activeScene = this.scene[name];
		this.startTime = Date.now();
		this.frame = -1; // シーン変更後のフレームが、0から始まるように
	}

	update() {
		let activeTime = (Date.now() - this.startTime) / 1000;

		// 経過時間を引数に与えて、updateFunctionを呼び出す

		this.activeScene(activeTime);
		++this.frame;
	}
}
