export default class Position {
	constructor(x, y) {
		this.x = null;
		this.y = null;
		this.set(x, y);
	}

	set(x, y) {
		if (x != null) {
			this.x = x;
		}
		if (y != null) {
			this.y = y;
		}
	}

	distance(target) {
		let x = this.x - target.x;
		let y = this.y - target.y;
		return Math.sqrt(x * x + y * y);
	}

	// 対象のクラストの外積を求める
	cross(target) {
		return this.x * target.y - this.y * target.x;
	}

	normalize() {
		let l = Math.sqrt(this.x * this.x + this.y * this.y);

		if (l === 0) {
			return new Position(0, 0);
		}

		let x = this.x / l;
		let y = this.y / l;

		return new Position(x, y);
	}

	rotate(rad) {
		let sin = Math.sin(rad);
		let cos = Math.cos(rad);

		this.x = this.x * cos + this.y * -sin;
		this.y = this.x * sin + this.y * cos
	}

	// ベクトル(x,y)からベクトルの長さを求める
	static calcLength(x, y) {
		return Math.sqrt(x * x + y * y);
	}

	// ベクトル(x,y)を単位ベクトルを求める
	static calcNormal(x, y) {
		let len = Position.calcLength(x, y);
		return new Position(x / len, y / len);
	}
}
