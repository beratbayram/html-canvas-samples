const SIZE = 1000;
const FRAME_RATE = 10;
const COLORS = ["#00FFFC", "#FC00FF", "#fffc00"];

let angle = 0;

// eslint-disable-next-line no-unused-vars
function main() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = SIZE;
  canvas.height = SIZE;

  // move origin to downleft corner
  ctx.save();
  ctx.translate(0, SIZE);
  ctx.scale(1, -1);

  setInterval(drawScene, FRAME_RATE, ctx);
}

function drawScene(ctx) {
  let pos = { x: 500, y: 600 };
  angle = (angle - 1) % 360;

  drawBackground(ctx);
  drawStick(ctx, 10);
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(1, 1);
  const points = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 200 },
  ];

  for (let i = 0; i < 6; i++) {
    ctx.rotate((60 * Math.PI) / 180);
    drawLeaf(ctx, i % 3, points);
  }

  ctx.rotate((60 * Math.PI) / 180);
  ctx.fillStyle = COLORS[0];
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawTexts(ctx);
  
  ctx.beginPath();
  ctx.fillStyle = "SaddleBrown";
  ctx.arc(SIZE/2, SIZE/2+100, 10, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(SIZE/2, SIZE/2+100, 5, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function drawLeaf(ctx, color, points) {
  ctx.save();
  ctx.fillStyle = COLORS[color];
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
  ctx.fill();

  ctx.moveTo(points[0].x, points[0].y);

  ctx.fillStyle = shadeColor(COLORS[color], -25);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.lineTo(points[3].x, points[3].y);
  ctx.closePath();

  ctx.fill();
  ctx.restore();
}

function drawTexts(ctx) {
  ctx.save();
  ctx.scale(1, -1);
  ctx.font = "30px arial";
  ctx.fillStyle = "#ffffff";

  ctx.textAlign = "left";
  ctx.fillText("Berat BAYRAM", 25, -250);
  ctx.fillText("324372", 25, -200);
  //ctx.fillText("", 25, -150);

  ctx.textAlign = "center";
  ctx.fillText(
    "Colors: turquoise (#00FFFC), hot pink (#FC00FF), lemon yellow (#fffc00)",
    SIZE / 2,
    -25
  );

  ctx.textAlign = "right";
  ctx.fillText("Triadic Color Palette", 975, -250);
  ctx.fillText("VWD Exercise 5", 975, -200);
  //ctx.fillText("", 975, -150);

  ctx.restore();
}

function drawStick(ctx, thickness) {
  ctx.fillStyle = "SaddleBrown";
  ctx.fillRect(SIZE / 2 - thickness / 2, SIZE / 10, thickness, 500);
}

function drawBackground(ctx) {
  ctx.fillStyle = "Green";
  ctx.fillRect(0, 0, SIZE, 300);
  ctx.fillStyle = "LightBlue";
  ctx.fillRect(0, 300, SIZE, SIZE - 300);
}

function shadeColor(color, percent) {
  // Source: https://stackoverflow.com/a/13532993
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}
