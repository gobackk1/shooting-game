export function simpleEaseIn(t) {
	return t * t * t * t;
}

export function generateRandomInt(range) {
	let random = Math.random();
	return Math.floor(random * range);
}

export function zeroPadding(number, count) {
	let zeroArray = new Array(count);
	let zeroString = zeroArray.join('0') + number;

	return zeroString.slice(-count);
}

// 度数法の角度からラジアンを求める
export function degToRad(deg) {
	return deg * Math.PI / 180;
}
