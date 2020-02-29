import Position from "./Position";

export default class BackgroundStar {
	constructor(ctx, size, speed, color = '#ffffff') {
		this.ctx = ctx;
		this.color = color;
		this.pos = null;

		// 星の大きさ
		this.size = size;

		// 星の移動速度
		this.speed = speed;
	}

	set(x, y) {
		this.pos = new Position(x, y);
	}

	update() {
		this.ctx.fillStyle = this.color;
		this.pos.y += this.speed;

		this.ctx.fillRect(
			this.pos.x - this.size / 2,
			this.pos.y - this.size / 2,
			this.size,
			this.size
		)

		// 画面下部を超えたら上へ戻す
		if (this.pos.y + this.size > this.ctx.canvas.height) {
			this.pos.y = -this.size;
		}
	}
}
