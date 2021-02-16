const SIZE = 1000;
const FRAME_RATE = 10;

class Sound {
	constructor(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
	}
	play() {
		this.sound.play().catch(null); //suppress no auto sound policy
	}
	stop() {
		this.sound.pause()
	}
}
class Box {
	constructor() {
		this.sound = new Sound('https://www.w3schools.com/graphics/bounce.mp3')

		this.posX = SIZE / 2;
		this.posY = SIZE * 0.9;
		this.stretchX = 0;
		this.stretchY = 0;
		this.posCounter = 0;
		this.speed = 0.01;
		this.isHappy = true;
	}

	getPos() {
		const currSpeed = Math.sin(this.posCounter * 4) * 15;

		this.posY -= currSpeed;
		this.posCounter += this.speed;

		this.isHappy = (this.posY > 800) ? false : true;
		if (this.posY > 900) this.sound.play();

		return {
			x: this.posX,
			y: this.posY
		}
	}

	getShape() {
		const currSpeed = Math.sin(this.posCounter * 4) * 15;


		this.stretchX = -Math.abs(currSpeed);
		this.stretchY = Math.abs(currSpeed) * 2;


		return {
			x: -100 - this.stretchX,
			y: -75 - this.stretchY,
			w: 200 + 2 * this.stretchX,
			h: 150 + 2 * this.stretchY,
		}
	}
}

// eslint-disable-next-line no-unused-vars
function main() {
	const canvas = document.getElementById('myCanvas');
	const ctx = canvas.getContext('2d');

	canvas.width = SIZE;
	canvas.height = SIZE;

	// move origin to downleft corner
	ctx.save();
	ctx.translate(0, SIZE);
	ctx.scale(1, -1);

	const box = new Box();
	setInterval(drawScene, FRAME_RATE, [ctx, box]);
}

function drawScene([ctx, box]) {
	drawBackground(ctx);

	const pos = box.getPos();
	const rect = box.getShape();

	drawRope(ctx, pos.y);
	drawBox(ctx, pos, rect);
	drawFace(ctx, pos, box.isHappy);
	drawTexts(ctx);

}
function drawTexts(ctx) {
	ctx.save();
	ctx.scale(1, -1);
	ctx.font = "30px arial";
	ctx.fillStyle = "#ffffff";

	ctx.textAlign = "left"
	ctx.fillText("Berat BAYRAM", 25, -250);
	ctx.fillText("(324372)", 25, -200);
	ctx.fillText("VWD Exercise 2", 25, -150);

	ctx.textAlign = "center"
	ctx.fillText("Makes sound when it hits the ceiling (open console if it doesn't open)", SIZE / 2, -25);

	ctx.textAlign = "right"
	ctx.fillText("> Used Principles <", 975, -250);
	ctx.fillText("Squash and stretch", 975, -200);
	ctx.fillText("Secondary Action", 975, -150);

	ctx.restore();
}

function drawBox(ctx, pos, rect) {
	ctx.save();

	ctx.fillStyle = 'black';
	ctx.translate(pos.x, pos.y);
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

	ctx.restore();
}
function drawFace(ctx, { x, y }, isHappy) {
	ctx.save();

	ctx.translate(x, y);
	ctx.lineWidth = 5;

	// Nose
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.arc(0, 0, 10, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();

	// Mouth
	ctx.beginPath();
	if (isHappy)
		ctx.arc(0, 20, 75, Math.PI * 1.2, Math.PI * 1.8);
	else
		ctx.arc(0, -100, 75, Math.PI * 0.2, Math.PI * 0.8);
	ctx.strokeStyle = 'white';
	ctx.stroke();
	ctx.closePath();

	// Right Eye
	ctx.beginPath();
	if (isHappy)
		ctx.arc(40, 30, 15, 0, Math.PI);
	else {
		ctx.moveTo(50, 50);
		ctx.lineTo(40, 40);
		ctx.lineTo(50, 30);
	}
	ctx.stroke();
	ctx.closePath();

	// Left Eye
	ctx.beginPath();
	if (isHappy)
		ctx.arc(-40, 30, 15, 0, Math.PI);
	else {
		ctx.moveTo(-50, 50);
		ctx.lineTo(-40, 40);
		ctx.lineTo(-50, 30);
	}
	ctx.stroke();
	ctx.closePath();

	ctx.restore();
}

function drawRope(ctx, y) {
	ctx.save();

	ctx.fillStyle = 'gray';
	const thickness = 15 - (975 - y) / 100;
	ctx.fillRect(SIZE / 2 - thickness / 2, y, thickness, 975 - y);

	ctx.restore();
}

function drawBackground(ctx) {
	ctx.save();

	ctx.fillStyle = 'SaddleBrown';
	ctx.fillRect(0, 0, SIZE, 300);
	ctx.fillStyle = 'LightBlue';
	ctx.fillRect(0, 300, SIZE, SIZE - 300);
	ctx.fillStyle = 'Brown';
	ctx.fillRect(SIZE / 4, 975, SIZE / 2, 25);

	ctx.restore();
}