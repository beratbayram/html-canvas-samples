const SIZE = 1000;
const FRAME_RATE = 10;

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
const bufferCanvas = document.getElementById("bufferCanvas");
const bufferCtx = canvas.getContext("2d");

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
    this.sound.pause();
  }
}

// eslint-disable-next-line no-unused-vars
function main() {
  const img = new Image();

  canvas.width = bufferCanvas.width = SIZE;
  canvas.height = bufferCanvas.height = SIZE;

  img.crossOrigin = "anonymous";
  img.src = "images/home.png";
  img.onload = () => {
    canvas.height = img.height / 4;
    canvas.width = img.width / 4;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    //ctx.fillRect(0, 0, 100, 100);
    pixelate(ctx, img);
    //setInterval(drawScene, FRAME_RATE, [ctx]);
    //drawScene([ctx]);
  };
}
function pixelate(ctx, img) {
  //dynamically adjust canvas size to the size of the uploaded image
  canvas.height = img.height;
  canvas.width = img.width;

  /// if in play mode use that value, else use slider value
  var size = 0.05,
    /// cache scaled width and height
    w = canvas.width * size,
    h = canvas.height * size;

  /// draw original image to the scaled size
  ctx.drawImage(img, 0, 0, w, h);
  bufferCtx.drawImage(canvas,0,0);

  /// then draw that scaled image thumb back to fill ctx
  /// As smoothing is off the result will be pixelated
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  //ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}
