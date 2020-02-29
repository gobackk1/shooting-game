import Shot from "./Shot";
import Position from "./Position";
import Viper from "./Viper";
import Enemy from "./Enemy";
import state from '../state';

export default class Homing extends Shot {
	constructor(ctx, x, y, w, h, imagePath) {
		super(ctx, x, y, w, h, imagePath);

		this.frame = 0;
	}

	set(x, y, speed, power) {
		this.pos.set(x, y);
		this.life = 1;
		this.setSpeed(speed);
		this.setPower(power);
		this.frame = 0;
	}

	update() {
		if (this.life <= 0) {
			return;
		}

		if (
			this.pos.x + this.width < 0 ||
			this.pos.x - this.width > this.ctx.canvas.width ||
			this.pos.y + this.height < 0 ||
			this.pos.y - this.height > this.ctx.canvas.height
		) {
			this.life = 0;
		}

		let target = this.targetArray[0];

		if (this.frame < 300) {
			let vector = new Position(
				target.pos.x - this.pos.x,
				target.pos.y - this.pos.y
			);

			let normalizedVector = vector.normalize();
			this.vector = this.vector.normalize();

			let cross = this.vector.cross(normalizedVector);
			let rad = Math.PI / 120;

			if (cross > 0.0){
				this.vector.rotate(rad);
			} else if (cross < 0.0) {
				this.vector.rotate(-rad);
			}
		}

		this.pos.x += this.vector.x * this.speed;
		this.pos.y += this.vector.y * this.speed;

		this.angle = Math.atan2(this.vector.y, this.vector.x);

		this.targetArray.map(v => {
			if (this.life <= 0 || v.life <= 0) {
				return;
			}

			let distance = this.pos.distance(v.pos);
			if (distance <= (this.width + v.width) / 4) {
				if (v instanceof Viper === true && v.isComing === true) {
					return;
				}
				v.life -= this.power;
				if (v.life <= 0) {
					for (let i = 0; i < this.explosionArray.length; i++) {
						if (this.explosionArray[i].life !== true) {
							this.explosionArray[i].set(v.pos.x, v.pos.y);
							break;
						}
					}
					if (v instanceof Enemy === true) {
						let score = 100;
						if (v.type === 'large') {
							score = 1000;
						}
						state.gameScore = Math.min(state.gameScore + score, 99999);
					}
				}
				this.life = 0;
			}
		});
		this.rotationDraw();
		++this.frame;
	}
}
