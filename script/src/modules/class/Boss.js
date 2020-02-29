import Character from "./Character";
import Position from "./Position";

export default class Boss extends Character {
	constructor(ctx, x, y, w, h, imagePath) {
		super(ctx, x, y, w, h, 0, imagePath);
		this.speed = 3;
		this.shotArray = null;
		this.homingArray = null;
		this.attackTarget = null;

		// 自身のモード
		this.mode = '';

		// 自身が出現してからのフレーム
		this.frame = 0;
	}

	set(x, y, life = 1) {
		this.pos.set(x, y);
		this.life = life;
		this.frame = 0;
	}

	setSpeed(speed) {
		this.speed = speed;
	}

	setMode(mode) {
		this.mode = mode;
	}

	setShotArray(shotArray) {
		this.shotArray = shotArray;
	}

	setHomingArray(homingArray) {
		this.homingArray = homingArray;
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

	homingFire(x = 0.0, y = 1.0, speed = 3.0) {
		for (let i = 0; i < this.homingArray.length; i++){
			if (this.homingArray[i].life <= 0) {
				this.homingArray[i].set(this.pos.x, this.pos.y);
				this.homingArray[i].setSpeed(speed);
				this.homingArray[i].setVector(x, y);
				break;
			}
		}
	}

	update() {
		if (this.life <= 0) {
			return;
		}

		switch (this.mode) {
			case 'invade':
				this.pos.y += this.speed;
				if (this.pos.y > 100) {
					this.pos.y = 100;
					this.mode = 'floating';
					this.frame = 0;
				}
				break;

			case 'escape':
				this.pos.y -= this.speed;
				if (this.pos.y < -this.height) {
					this.life = 0;
				}
				break;

			case 'floating':
				if (this.frame % 1000 < 500) {
					if (this.frame % 200 > 140 && this.frame % 8 === 0) {
						let tx = this.attackTarget.pos.x - this.pos.x;
						let ty = this.attackTarget.pos.y - this.pos.y;

						let tv = Position.calcNormal(tx, ty);
						this.fire(tv.x, tv.y, 4.7);
						this.fire(tv.x - 0.15, tv.y, 4.0);
						this.fire(tv.x + 0.15, tv.y, 4.0);
					}
				} else {
					if (this.frame % 80 === 0) {
						let tx = this.attackTarget.pos.x - this.pos.x;
						let ty = this.attackTarget.pos.y - this.pos.y;

						let tv = Position.calcNormal(tx, ty);
						this.homingFire(tv.x, tv.y, 3);
					}
				}

				this.pos.x += Math.cos(this.frame / 100) * 2.0;
				break;
			default:
				break;
		}
		this.draw();
		++this.frame;
	}
}
