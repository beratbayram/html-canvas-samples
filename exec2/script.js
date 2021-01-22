const SIZE = 1000;

function removeOverlay() {
	let element = document.getElementById("overlay")
	element.style.display = "none";
}

function main() {
	removeOverlay();
	drawScene();
}

function drawScene() {

}
/*
function drawScene() {
	let canvas = document.getElementById("myCanvas")
	let ctx = canvas.getContext("2d");

	canvas.width = SIZE;
	canvas.height = SIZE;
	drawBackground(ctx);

	let properties = {
		levels: 6,
		wallColor: 'brown',
		roofColor: null,
		door: true
	}
	properties.roofColor = getRandomColor();
	drawHouse(ctx, [SIZE * 0.85, SIZE * 0.6], SIZE * 0.2, properties);

	properties.roofColor = getRandomColor();
	drawHouse(ctx, [SIZE * 0.6, SIZE * 0.7], SIZE * 0.3, properties);


	drawTree(ctx, [SIZE * 0.14, SIZE * 0.8], SIZE * 0.4, properties);


	properties.roofColor = getRandomColor();
	drawHouse(ctx, [SIZE * 0.34, SIZE * 0.8], SIZE * 0.4, properties);

	for (let index = 0; index < randomIntFromInterval(1, 10); index++)
		drawCloud(ctx, getRandomCloudProperties());

	drawSun(ctx);
	drawMainRoad(ctx);

}
function drawMainRoad(ctx)
{
	ctx.save();
	ctx.fillStyle = "gray";
	ctx.lineWidth = 0.01;

	ctx.beginPath();
	ctx.moveTo(SIZE, 650);
	//ctx.lineTo(SIZE, 600);
	ctx.quadraticCurveTo(700,700,300,SIZE);
	ctx.lineTo(600,SIZE);
	ctx.quadraticCurveTo(800,800,SIZE,700);

	// ctx.quadraticCurveTo(-0.2,0.3,0,0);
	// ctx.moveTo(0, 0);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}
function randomIntFromInterval(min, max) { // min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomCloudProperties() {
	return {
		x: randomIntFromInterval(0, SIZE - 300),
		y: randomIntFromInterval(0, SIZE * 0.5 - 200),
		scale: Math.random() * 2
	}
}

function drawCloud(ctx, { x, y, scale }) {
	ctx.save();
	ctx.fillStyle = 'white';

	ctx.beginPath();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.arc(0, 0, 25, 0, 2 * Math.PI);
	ctx.arc(50, -10, 35, 0, 2 * Math.PI);
	ctx.arc(100, 0, 25, 0, 2 * Math.PI);
	ctx.rect(0, 0, 100, 25);
	ctx.closePath();

	ctx.fill();
	ctx.restore();
}

function drawSun(ctx) {
	ctx.save();
	ctx.fillStyle = 'rgba(255,255,0,1)';
	ctx.strokeStyle = 'black';
	//Sun itself
	ctx.beginPath();
	ctx.arc(SIZE, 0, 100, 0, 2 * Math.PI);
	ctx.fill()
	ctx.stroke();

	ctx.fillStyle = 'rgba(255,255,0,0.5)';

	ctx.translate(SIZE - 275, 0);
	for (let index = 0; index < 6; index++) {
		ctx.rect(0, 0, 150, 5);
		ctx.translate(13, 83);
		ctx.rotate(-0.1 * Math.PI);
	}

	// set line color
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

function drawBackground(ctx) {
	ctx.beginPath();
	ctx.fillStyle = "lightblue";
	ctx.rect(0, 0, SIZE, SIZE * 0.5);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "green";
	ctx.rect(0, SIZE * 0.5, SIZE, SIZE * 0.5);
	ctx.fill();
}

function getRandomColor() {
	let red = Math.floor(Math.random() * 255);
	let green = Math.floor(Math.random() * 255);
	let blue = Math.floor(Math.random() * 255);
	return "rgba(" + red + "," + green + "," + blue + ",1)";
}

function drawHouse(ctx, location, scale, properties) {
	ctx.beginPath();

	ctx.save();
	ctx.translate(location[0], location[1]);
	ctx.scale(scale, scale);
	ctx.lineWidth = 0.04;

	ctx.fillStyle = properties.wallColor;

	// walls of the house
	for (let i = 1; i <= properties.levels; i++) {
		ctx.beginPath();
		ctx.rect(-0.5, -0.1, 1.0, 0.1);
		ctx.stroke();
		ctx.fill();
		ctx.translate(0, -0.1);
		//ctx.rotate((Math.random()-0.5)*0.2); // in radians
		// 360 degrees is 2 PI radians
	}

	//roof
	ctx.fillStyle = properties.roofColor;
	ctx.translate(0, -0.01);
	ctx.beginPath();
	ctx.moveTo(-0.5, -0.0);
	ctx.lineTo(+0.5, -0.0);
	ctx.lineTo(+0.0, -0.4);
	ctx.lineTo(-0.5, -0.0);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.restore();

	//door
	if (properties.door == true) {
		ctx.save();
		ctx.translate(location[0], location[1]);
		ctx.scale(scale, scale);
		ctx.lineWidth = 0.01;

		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.rect(0, -0.285, 0.2, 0.285);
		ctx.stroke();
		ctx.fill();

		//road
		ctx.restore();
		ctx.save();


		ctx.translate(location[0], location[1]);
		ctx.fillStyle = "gray";
		ctx.lineWidth = 0.01;
		ctx.scale(scale, scale);

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0.2, 0);
		ctx.quadraticCurveTo(0,0.3,0.5,0.5);
		ctx.lineTo(0,0.5);
		ctx.quadraticCurveTo(-0.2,0.3,0,0);
		ctx.moveTo(0, 0);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

	}

}

function drawTree(ctx, location, scale, properties) {
	ctx.beginPath();

	ctx.save();
	ctx.translate(location[0], location[1]);
	ctx.scale(scale, scale);
	ctx.lineWidth = 0.04;

	ctx.fillStyle = properties.wallColor;

	//trunk
	ctx.beginPath();
	ctx.rect(-0.1, -0.2, 0.02, 0.1);
	ctx.stroke();
	ctx.fill();

	ctx.translate(-0.08, -0.1);

	ctx.fillStyle = "rgba(0,255,0,1)";
	ctx.beginPath();
	ctx.moveTo(-0.2, -0.1);
	ctx.lineTo(+0.2, -0.1);
	ctx.lineTo(+0.0, -0.7);
	ctx.lineTo(-0.2, -0.1);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.restore();
}
*/