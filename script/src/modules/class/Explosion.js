import Position from './Position';
import { simpleEaseIn } from '../util';

export default class Explosion {
	constructor(ctx, radius, count, size, timeRange, color = '#ff1166') {
		this.ctx = ctx;
		this.life = false;
		this.color = color;
		this.sound = null;

		// 爆発の座標
		this.pos = null;

		// 爆発の半径
		this.radius = radius;

		// 生成する火花の数
		this.count = count;

		// 爆発開始のタイムスタンプ
		this.startTime = 0;

		// 爆発が消えるまでの時間
		this.timeRange = timeRange;

		// 火花の大きさ
		this.fireBaseSize = size;

		// 火花の1つあたりの大きさを格納
		this.fireSize = [];

		// 火花の位置を格納
		this.firePos = [];

		// 火花の進行方向
		this.fireVector = [];
	}

	set(x, y) {
		for (let i = 0; i < this.count; i++){
			this.firePos[i] = new Position(x, y);

			let vr = Math.random() * Math.PI * 2;
			let sin = Math.sin(vr);
			let cos = Math.cos(vr);
			let mr = Math.random();
			this.fireVector[i] = new Position(cos * mr, sin * mr);
			// fireBaseSize の 0.5 ~ 1.0 倍のランダムな大きさを格納
			this.fireSize[i] = (Math.random() * 0.5 + 0.5) * this.fireBaseSize;
		}

		this.life = true;
		this.startTime = Date.now();
		if (this.sound != null) {
			this.sound.play();
		}
	}

	setSound(sound) {
		this.sound = sound;
	}

	update() {
		if (this.life !== true) {
			return;
		}

		this.ctx.fillStyle = this.color;
		this.ctx.globalAlpha = 0.5;

		let time = (Date.now() - this.startTime) / 1000;
		let ease = simpleEaseIn(1.0 - Math.min(time / this.timeRange, 1.0));
		let progress = 1.0 - ease;

		for (let i = 0; i < this.firePos.length; i++){
			// 火花が広がる距離
			let d = this.radius * progress;
			let x = this.firePos[i].x + this.fireVector[i].x * d;
			let y = this.firePos[i].y + this.fireVector[i].y * d;
			let s = 1.0 - progress;

			this.ctx.fillRect(
				x - (this.fireSize[i] * s) / 2,
				y - (this.fireSize[i] * s) / 2,
				this.fireSize[i] * s,
				this.fireSize[i] * s
			)
		}

		this.ctx.globalAlpha = 1.0;

		// 爆発終了
		if (progress >= 1.0) {
			this.life = false;
		}
	}
}
