import Character from "./Character";
import Position from "./Position";
import { generateRandomInt } from '../util';

export default class Enemy extends Character {
	constructor(ctx, x, y, w, h, imagePath) {
		super(ctx, x, y, w, h, 0, imagePath);

		this.speed = 3;
		this.shotArray = null;
		this.type = 'default';
		this.frame = 0; // 自身が登場してからのフレーム
		this.attackTarget = null;
	}

	set(x, y, life = 1, type = 'default') {
		this.pos.set(x, y);
		this.life = life;
		this.type = type;
		this.frame = 0;
	}

	setShotArray(shotArray) {
		this.shotArray = shotArray;
	}

	setAttackTarget(target) {
		this.attackTarget = target;
	}

	fire(x = 0.0, y = 1.0, speed = 5.0) {
		for (let i = 0; i < this.shotArray.length; i++){
			if (this.shotArray[i].life <= 0) {
				this.shotArray[i].set(this.pos.x, this.pos.y);
				this.shotArray[i].setSpeed(speed);
				this.shotArray[i].setVector(x, y);
				break;
			}
		}
	}

	update() {
		if (this.life <= 0) {
			return;
		}

		switch (this.type) {
			case 'wave':
				if (this.frame % 60 === 0) {
					let tx = this.attackTarget.pos.x - this.pos.x;
					let ty = this.attackTarget.pos.y - this.pos.y;

					let tv = Position.calcNormal(tx, ty);
					this.fire(tv.x, tv.y, 4.0);
				}

				this.pos.x += Math.sin(this.frame / 10);
				this.pos.y += 2.0;

				if (this.pos.y - this.height > this.ctx.canvas.height) {
					this.life = 0;
				}
				break;

			case 'large':
				if (this.frame % 50 === 0) {
					for (let i = 0; i < 360; i += 45) {
						let r = i * Math.PI / 180;
						let sin = Math.sin(r);
						let cos = Math.cos(r);

						this.fire(cos, sin, 2.5);
					}
				}

				this.pos.x += Math.sin((this.frame + 90) / 50) * 2.0;
				this.pos.y += 1.0;

				if (this.pos.y - this.height > this.ctx.canvas.height) {
					this.life = 0;
				}
				break;

			case 'default':
			default:
				if (this.frame === 50) {
					this.fire();
				}

				this.pos.x += this.vector.x * this.speed;
				this.pos.y += this.vector.y * this.speed;

				if (this.pos.y - this.height > this.ctx.canvas.height) {
					this.life = 0;
				}
				break;
		}

		this.draw();
		++this.frame;
	}
}
