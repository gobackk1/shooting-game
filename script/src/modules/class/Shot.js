import state from "../state";
import Character from "./Character";
import Viper from "./Viper";
import Enemy from "./Enemy";
import Boss from "./Boss";

export default class Shot extends Character {
	constructor(ctx, x, y, w, h, imagePath) {
		super(ctx, x, y, w, h, 0, imagePath);

		// ショットが進むスピード
		this.speed = 7;

		// ショットのダメージ
		this.power = 1;

		// 自身と衝突判定する対象
		this.targetArray = [];

		// 爆発インスタンスを格納
		this.explosionArray = [];
	}

	set(x, y, speed, power) {
		this.pos.set(x, y);
		this.life = 1;
		this.setSpeed(speed);
		this.setPower(power);
	}

	setSpeed(speed) {
		if (speed != null && speed > 0) {
			this.speed = speed;
		}
	}

	setPower(power) {
		if (power != null && power > 0) {
			this.power = power;
		}
	}

	setTargetArray(targetArray) {
		if (Array.isArray(targetArray) && targetArray != null && targetArray.length > 0) {
			this.targetArray = targetArray;
		}
	}

	setExplosionArray(explosionArray) {
		if (Array.isArray(explosionArray) && explosionArray != null && explosionArray.length > 0) {
			this.explosionArray = explosionArray;
		}
	}

	update() {
		if (this.life <= 0) {
			return;
		}

		if (this.pos.y + this.height < 0 ||
			this.pos.y - this.height > this.ctx.canvas.height ||
			this.pos.x + this.width < 0 ||
			this.pos.x - this.width > this.ctx.canvas.width
		) {
			this.life = 0;
		}

		this.pos.x += this.vector.x * this.speed;
		this.pos.y += this.vector.y * this.speed;

		// 衝突判定
		this.targetArray.map(v => {
			if (this.life <= 0 || v.life <= 0) {
				return;
			}

			let distance = this.pos.distance(v.pos);
			if (distance <= (this.width + v.width) / 4) {
				// 自機キャラクターの場合、搭乗中は無敵
				if (v instanceof Viper === true && v.isComing === true){
					return;
				}

				v.life -= this.power;
				if (v.life <= 0) {
					for (let i = 0; i < this.explosionArray.length; i++){
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
					} else if (v instanceof Boss === true) {
						state.gameScore = Math.min(state.gameScore + 15000, 99999);
					}
				}
				this.life = 0;
			}
		})

		this.rotationDraw();
	}
}
