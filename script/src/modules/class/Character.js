import Position from './Position';

export default class Character {
	constructor(ctx, x, y, w, h, life, imagePath) {
		this.ctx = ctx;
		this.pos = new Position(x, y);
		this.width = w;
		this.height = h;

		// 生存状態
		this.life = life;

		// インスタンスに適用する画像
		this.image = new Image();
		this.image.addEventListener('load', () => {
			this.ready = true;
		});
		this.image.src = imagePath;

		// 画像の読み込みが完了したか
		this.ready = false;

		// 進行方向
		this.vector = new Position(0.0, -1.0);

		// 描画する画像の向き
		this.angle = 270 * Math.PI / 180;
	}

	setVector(x, y) {
		this.vector.set(x, y);
	}

	setVectorFromAngle(angle) {
		this.angle = angle;
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		this.vector.set(cos, sin);
	}

	rotationDraw() {
		this.ctx.save();

		this.ctx.translate(this.pos.x, this.pos.y);

		// 上方向(270)が基準点のため
		this.ctx.rotate(this.angle - Math.PI * 1.5);

		let offsetX = this.width / 2;
		let offsetY = this.height / 2;

		this.ctx.drawImage(
			this.image,
			-offsetX,
			-offsetY,
			this.width,
			this.height
		);

		this.ctx.restore();
	}

	draw() {
		let offsetX = this.width / 2;
		let offsetY = this.height / 2;
		this.ctx.drawImage(
			this.image,
			this.pos.x - offsetX,
			this.pos.y - offsetY,
			this.width,
			this.height
		);
	}
}
