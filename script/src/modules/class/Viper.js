import state from "../state";
import Character from "./Character";
import Position from './Position';

export default class Viper extends Character {
	constructor(ctx, x, y, w, h, image) {
		super(ctx, x, y, w, h, 1, image);

		// 登場中か表すフラグ
		this.isComing = false;

		// 登場演出を開始したタイムスタンプ
		this.comingStart = null;

		// 登場演出を開始する座標
		this.comingStartPos = null;

		// 登場演出を完了とする座標
		this.comingEndPos = null;

		// 自信を動かすスピード
		this.speed = 4;

		// ショットのインスタンス配列
		this.shotArray = null;
		this.singleShotArray = null;

		// ショット生成間隔を調整するカウンタ
		this.shotCheckCounter = 0;

		// ショットの間隔（フレーム）
		this.shotInterval = 10;
	}

	setComing(startX, startY, endX, endY) {
		this.isComing = true;
		this.life = 1;
		this.comingStart = Date.now();
		this.pos.set(startX, startY);
		this.comingStartPos = new Position(startX, startY);
		this.comingEndPos = new Position(endX, endY);
	}

	setShotArray(shotArray, singleShotArray) {
		this.shotArray = shotArray;
		this.singleShotArray = singleShotArray;
	}

	update() {
		if (this.life <= 0) {
			return;
		}

		let justTime = Date.now();

		if (this.isComing === true) {
			let comingTime = (justTime - this.comingStart) / 1000;
			let y = this.comingStartPos.y - comingTime * 50;

			if (y <= this.comingEndPos.y) {
				this.isComing = false;
				y = this.comingEndPos.y;
			}

			this.pos.set(this.pos.x, y);

			if (justTime % 100 < 50) {
				this.ctx.globalAlpha = 0.5;
			}
		} else {
			if (state.isKeyDown.key_ArrowLeft === true) {
				this.pos.x -= this.speed;
			}
			if (state.isKeyDown.key_ArrowRight === true) {
				this.pos.x += this.speed;
			}
			if (state.isKeyDown.key_ArrowUp === true) {
				this.pos.y -= this.speed;
			}
			if (state.isKeyDown.key_ArrowDown === true) {
				this.pos.y += this.speed;
			}

			// 移動後の位置が画面外に出ていたら修正
			let canvasWidth = this.ctx.canvas.width;
			let canvasHeight = this.ctx.canvas.height;
			let tx = Math.min(Math.max(this.pos.x, 0), canvasWidth);
			let ty = Math.min(Math.max(this.pos.y, 0), canvasHeight);

			this.pos.set(tx, ty);

			if (state.isKeyDown.key_z === true) {
				if (this.shotCheckCounter >= 0) {
					for (let si = 0; si < this.shotArray.length; si++){
						if (this.shotArray[si].life <= 0) {
							this.shotArray[si].set(this.pos.x, this.pos.y);
							// this.shotArray[si].setPower(2);
							this.shotCheckCounter = -this.shotInterval;
							break;
						}
					}

					for (let ssi = 0; ssi < this.singleShotArray.length; ssi += 2){
						if (
							this.singleShotArray[ssi].life <= 0 &&
							this.singleShotArray[ssi + 1].life <= 0
						) {
							let radCW = 265 * Math.PI / 180;
							let radCCW = 275 * Math.PI / 180;

							this.singleShotArray[ssi].set(this.pos.x - 20, this.pos.y);
							this.singleShotArray[ssi].setVectorFromAngle(radCW);
							this.singleShotArray[ssi + 1].set(this.pos.x + 20, this.pos.y);
							this.singleShotArray[ssi + 1].setVectorFromAngle(radCCW);
							this.shotCheckCounter = -this.shotInterval;
							break;
						}

					}
				}
			}

			++this.shotCheckCounter;
		}
		this.draw();

		this.ctx.globalAlpha = 1.0;
	}
}
