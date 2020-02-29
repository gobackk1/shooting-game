import Canvas2DUtility from './modules/class/Canvas2DUtility';
import Viper from './modules/class/Viper';
import Shot from './modules/class/Shot';
import Enemy from './modules/class/Enemy';
import Explosion from './modules/class/Explosion';
import SceneManager from './modules/class/SceneManager';
import Sound from './modules/class/Sound';
import BackgroundStar from './modules/class/BackgroundStar';
import Homing from './modules/class/Homing';
import Boss from './modules/class/Boss';
import state from './modules/state';
import { zeroPadding, degToRad, generateRandomInt } from './modules/util'

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 700;
const SHOT_MAX_COUNT = 10;
const ENEMY_SMALL_MAX_COUNT = 20;
const ENEMY_LARGE_MAX_COUNT = 5;
const ENEMY_SHOT_MAX_COUNT = 50;
const HOMING_MAX_COUNT = 50;
const EXPLOSION_MAX_COUNT = 10;
const BACKGROUND_STAR_MAX_COUNT = 100;
const BACKGROUND_STAR_MAX_SIZE = 3;
const BACKGROUND_STAR_MAX_SPEED = 4;

let util = null; // Canvas2DUtility
let canvas = null;
let ctx = null;
let startTime = null; // ゲーム開始タイムスタンプ
let shotArray = []; // ショットのインスタンスを格納
let singleShotArray = []; // シングルショットのインスタンスを格納
let enemyArray = []; // 敵キャラクタのインスタンスを格納
let enemyShotArray = []; // 敵のショットを格納
let explosionArray = []; // 爆発のインスタンスを格納
let backgroundStarArray = []; // 星のインスタンスを格納
let homingArray = [];
let viper = null; // 自機キャラクターのインスタンス
let scene = null; // シーンマネージャー
let sound = null;
let boss = null;
let restart = false; // 再スタートするためのフラグ
let bgmLoaded = false; // bgmの読み込みが完了しているか

window.addEventListener('load', () => {
	util = new Canvas2DUtility(document.querySelector('#canvas'));
	canvas = util.canvas;
	ctx = util.context;
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	let startButton = document.querySelector('#btn-start');
	let bgmButton = document.querySelector('#btn-bgm');
	let bgm = document.querySelector('#bgm');

	// startButton.addEventListener('click', async () => {
	// 	startButton.disabled = true;
	// 	sound = new Sound();

	// 	await sound.load('../../sound/small_explosion1.mp3');
	// 	initialize();
	// 	loadCheck();
	// });
	startButton.addEventListener('click', () => {
		startButton.disabled = true;
		sound = new Sound();
		sound.load('./sound/small_explosion1.mp3', (error) => {
			// もしエラーが発生した場合はアラートを表示して終了する
			if(error != null){
				alert('ファイルの読み込みエラーです');
				return;
			}
			// 初期化処理を行う
			initialize();
			// インスタンスの状態を確認する
			loadCheck();
		});
	}, false);

	bgmButton.addEventListener('click', () => {
		if (!bgmLoaded) {
			bgm.addEventListener('canplaythrough', function fn() {
				bgm.play();
				bgmButton.disabled = false;
				bgmButton.value = 'BGMを停止する';
				bgmLoaded = true;
				bgm.removeEventListener('canplaythrough', fn);
			});
			bgm.src = bgm.dataset.src;
			bgmButton.disabled = true;
			bgmButton.value = 'BGM読み込み中';
		} else {
			if (bgm.paused) {
				bgm.play();
				bgmButton.value = 'BGMを停止する';
			} else {
				bgm.pause();
				bgmButton.value = 'BGMを再生する';
			}
		}
	});
});

function initialize() {
	let i;

	viper = new Viper(ctx, 0, 0, 64, 64, '../../image/viper_2.png');
	viper.setComing(
		CANVAS_WIDTH / 2,
		CANVAS_HEIGHT,
		CANVAS_WIDTH / 2,
		CANVAS_HEIGHT - 100
	);

	scene = new SceneManager();

	for (i = 0; i < EXPLOSION_MAX_COUNT; i++){
		explosionArray[i] = new Explosion(ctx, 100, 15, 40, 1);
		explosionArray[i].setSound(sound);
	}

	for (i = 0; i < SHOT_MAX_COUNT; i++){
		shotArray[i] = new Shot(ctx, 0, 0, 32, 32, '../../image/viper_shot_normal_2.png');
		shotArray[i].setSpeed(8.5);
		singleShotArray[i * 2] = new Shot(ctx, 0, 0, 32, 32, '../../image/viper_shot_normal_2.png');
		singleShotArray[i * 2].setSpeed(8);
		singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, '../../image/viper_shot_normal_2.png');
		singleShotArray[i * 2 + 1].setSpeed(8);
	}

	for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
		enemyShotArray[i] = new Shot(ctx, 0, 0, 24, 24, '../../image/enemy_shot_1.png');
		enemyShotArray[i].setTargetArray([viper]);
		enemyShotArray[i].setExplosionArray(explosionArray);
	}

	for (i = 0; i < HOMING_MAX_COUNT; i++){
		homingArray[i] = new Homing(ctx, 0, 0, 32, 32, '../../image/enemy_homing_shot.png');
		homingArray[i].setTargetArray([viper]);
		homingArray[i].setExplosionArray(explosionArray);
	}

	boss = new Boss(ctx, 0, 0, 128, 128, '../../image/boss_1.png');
	boss.setShotArray(enemyShotArray);
	boss.setHomingArray(homingArray);
	boss.setAttackTarget(viper);

	for (i = 0; i < ENEMY_SMALL_MAX_COUNT; i++){
		enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, '../../image/enemy_small_1.png');
		enemyArray[i].setShotArray(enemyShotArray);
		enemyArray[i].setAttackTarget(viper);
	}

	for (i = 0; i < ENEMY_LARGE_MAX_COUNT; i++){
		enemyArray[ENEMY_SMALL_MAX_COUNT + i] = new Enemy(ctx, 0, 0, 64, 64, '../../image/enemy_large_1.png');
		enemyArray[ENEMY_SMALL_MAX_COUNT + i].setShotArray(enemyShotArray);
		enemyArray[ENEMY_SMALL_MAX_COUNT + i].setAttackTarget(viper);
	}

	let concatEnemyArray = enemyArray.concat([boss]);

	for (i = 0; i < SHOT_MAX_COUNT; i++){
		shotArray[i].setTargetArray(concatEnemyArray);
		singleShotArray[i * 2].setTargetArray(concatEnemyArray);
		singleShotArray[i * 2 + 1].setTargetArray(concatEnemyArray);
		shotArray[i].setExplosionArray(explosionArray);
		singleShotArray[i * 2].setExplosionArray(explosionArray);
		singleShotArray[i * 2 + 1].setExplosionArray(explosionArray);
	}

	for (i = 0; i < BACKGROUND_STAR_MAX_COUNT; i++){
		let size = 1 + Math.random() * (BACKGROUND_STAR_MAX_SIZE - 1);
		let speed = 1 + Math.random() * (BACKGROUND_STAR_MAX_SPEED - 1);
		backgroundStarArray[i] = new BackgroundStar(ctx, size, speed);

		let x = Math.random() * CANVAS_WIDTH;
		let y = Math.random() * CANVAS_HEIGHT;
		backgroundStarArray[i].set(x, y);
	}

	viper.setShotArray(shotArray, singleShotArray);
}

function loadCheck() {
	// 各画像が読み込み完了しているかチェック
	let ready = true;
	ready = ready && viper.ready;
	ready = ready && boss.ready;
	shotArray.map(v => ready = ready && v.ready);
	singleShotArray.map(v => ready = ready && v.ready);
	enemyArray.map(v => ready = ready && v.ready);
	enemyShotArray.map(v => ready = ready && v.ready);

	if (ready === true) {
		eventSetting();
		sceneSetting();
		startTime = Date.now();
		render();
	} else {
		setTimeout(loadCheck, 100);
	}
}

function render() {
	ctx.globalAlpha = 1.0;
	util.drawRect(0, 0, canvas.width, canvas.height, '#111122');

	ctx.font = 'bold 24px monospace';
	util.drawText(zeroPadding(state.gameScore, 5), 30, 50, '#ffffff');

	let nowTime = (Date.now() - startTime) / 1000;

	scene.update();
	viper.update();
	boss.update();
	shotArray.map(v => v.update());
	singleShotArray.map(v => v.update());
	enemyArray.map(v => v.update());
	enemyShotArray.map(v => v.update());
	explosionArray.map(v => v.update());
	backgroundStarArray.map(v => v.update());
	homingArray.map(v => v.update());

	requestAnimationFrame(render);
}

function eventSetting() {
	window.addEventListener('keydown', (event) => {
		state.isKeyDown[`key_${event.key}`] = true;

		if (event.key === 'Enter') {
			if (viper.life <= 0) {
				restart = true;
			}
		}
	});
	window.addEventListener('keyup', (event) => {
		state.isKeyDown[`key_${event.key}`] = false;
	});
}

function sceneSetting() {
	scene.add('intro', time => {
		if (time > 2.0) {
			scene.use('invade_default_type');
		}
	});

	scene.add('invade_default_type', time => {
		if (scene.frame % 30 === 0) {
			for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) {
				if (enemyArray[i].life <= 0) {
					let e = enemyArray[i];
					if (scene.frame % 60 === 0) {
						e.set(-e.width, 30, 2, 'default');
						e.setVectorFromAngle(degToRad(30));
					} else {
						e.set(CANVAS_WIDTH + e.width, 30, 2, 'default');
						e.setVectorFromAngle(degToRad(150));
					}
					break;
				}
			}
		}
		if (scene.frame === 270) {
			scene.use('blank');
		}

		if (viper.life <= 0) {
			scene.use('gameover');
		}
	});

	scene.add('blank', time => {
		if (scene.frame === 150) {
			scene.use('invade_wave_move_type');
		}

		if (viper.life <= 0) {
			scene.use('gameover');
		}
	});

	scene.add('invade_wave_move_type', time => {
		if (scene.frame % 50 === 0) {
			for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) {
				if (enemyArray[i].life <= 0) {
					let e = enemyArray[i];
					let range = 0.1 + Math.random() * 0.8;
					e.set(CANVAS_WIDTH * range, -e.height, 2, 'wave');
					// if (scene.frame <= 200) {
					// 	e.set(CANVAS_WIDTH * 0.2, -e.height, 2, 'wave');
					// } else {
					// 	e.set(CANVAS_WIDTH * 0.8, -e.height, 2, 'wave');
					// }
					break;
				}
			}
		}
		if (scene.frame === 450) {
			scene.use('invade_large_type');
		}

		if (viper.life <= 0) {
			scene.use('gameover');
		}
	});

	scene.add('invade_large_type', time => {
		if (scene.frame === 100) {
			let i = ENEMY_SMALL_MAX_COUNT + ENEMY_LARGE_MAX_COUNT;
			for (let j = ENEMY_SMALL_MAX_COUNT; j < i; j++) {
				if (enemyArray[j].life <= 0) {
					let e = enemyArray[j];
					e.set(CANVAS_WIDTH / 3, -e.height, 40, 'large');
					break;
				}
			}
		}
		if (scene.frame === 200) {
			let i = ENEMY_SMALL_MAX_COUNT + ENEMY_LARGE_MAX_COUNT;
			for (let j = ENEMY_SMALL_MAX_COUNT; j < i; j++) {
				if (enemyArray[j].life <= 0) {
					let e = enemyArray[j];
					e.set(CANVAS_WIDTH / 1.5, -e.height, 40, 'large');
					break;
				}
			}
		}
		if (scene.frame === 800) {
			scene.use('invade_boss');
		}

		if (viper.life <= 0) {
			scene.use('gameover');
		}
	});

	scene.add('invade_boss', time => {
		if (scene.frame === 0) {
			boss.set(CANVAS_WIDTH / 2, -boss.height, 250);
			boss.setMode('invade');
		}

		if (viper.life <= 0) {
			scene.use('gameover');
			boss.setMode('escape');
		}

		if (boss.life <= 0) {
			scene.use('intro');
		}
	});

	scene.add('gameover', time => {
		let textWidth = CANVAS_WIDTH / 2;
		let loopWidth = textWidth + CANVAS_WIDTH;

		// 割った余りを利用することで、リピートできるように
		let x = CANVAS_WIDTH - (scene.frame * 2) % loopWidth;

		ctx.font = 'bold 72px sans-serif';
		util.drawText('GAME OVER', x, CANVAS_HEIGHT / 2, '#ff0000', textWidth);

		if (restart === true) {
			restart = false;
			state.gameScore = 0;
			viper.setComing(
				CANVAS_WIDTH / 2,
				CANVAS_HEIGHT + 50,
				CANVAS_WIDTH / 2,
				CANVAS_HEIGHT - 100
			);

			scene.use('intro');
		}
	});

	scene.use('intro');
}
