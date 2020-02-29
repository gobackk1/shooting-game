export default class Canvas2dUtility {
	constructor(canvas) {
		this.canvasElement = canvas;
		this.ctx = canvas.getContext("2d");
	}

	get canvas() {
		return this.canvasElement;
	}

	get context() {
		return this.ctx;
	}

	drawRect(x, y, width, height, color) {
		if (color != null) {
			this.ctx.fillStyle = color;
		}

		this.ctx.fillRect(x, y, width, height);
	}

	drawLine(x1, y1, x2, y2, color, width = 1) {
		if (color != null) {
			this.ctx.strokeStyle = color;
		}

		this.ctx.lineLength = width;
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	drawPolygon(points, color) {
		if (Array.isArray(points) !== true || points.length < 6) {
			return;
		}

		if (color != null) {
			this.ctx.fillStyle = color;
		}

		this.ctx.beginPath();
		this.ctx.moveTo(points[0], points[1]);

		for (let i = 2; i < points.length; i += 2) {
			this.ctx.lineTo(points[i], points[i + 1]);
		}

		this.ctx.closePath();
		this.ctx.fill();
	}

	drawCircle(x, y, radius, color) {
		if (color != null) {
			this.ctx.fillStyle = color;
		}

		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0.0, Math.PI * 2);
		this.ctx.closePath();
		this.ctx.fill();
	}

	drawFan(x, y, radius, startRadian, endRadian, color) {
		if (color != null) {
			this.ctx.fillStyle = color;
		}

		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.arc(x, y, radius, startRadian, endRadian);
		this.ctx.closePath();
		this.ctx.fill();
	}

	drawQuadraticBezier(x1, y1, x2, y2, cx, cy, color, width = 1) {
		if (color != null) {
			this.ctx.fillStyle = color;
		}

		this.ctx.lineLength = width;
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.quadraticCurveTo(cx, cy, x2, y2);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	drawCubicBezier(x1, y1, x2, y2, cx1, cy1, cx2, cy2, color, width = 1) {
		if (color != null) {
			this.ctx.fillStyle = color;
		}

		this.ctx.lineLength = width;
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	drawText(text, x, y, color, width) {
		if (color != null) {
			this.ctx.fillStyle = color;
		}

		this.ctx.fillText(text, x, y, width);
	}

	imageLoader(path) {
		return new Promise(resolve => {
			let target = new Image();
			target.addEventListener('load', () => {
				resolve(target);
			})
			target.src = path;
		})
	}

}
