var VIDEO = null;
var SIZE = 1000;
var CANVAS;
var EFFECT_INDEX = 0;
var EFFECTS = [
  "normal",
  "gray",
  "invert",
  "symmetry",
  "mirror",
  "averageSymmetry",
  "stack",
];
var isEffectEnabled = false;
var isSoundEnabled = false;
var BUFFER = [];
var isPlaying = false;
let oscNode;
let gainNode;

const audioContext = new (AudioContext ||
  // eslint-disable-next-line no-undef
  webkitAudioContext ||
  window.webkitAudioContext)();

function playSound(enable) {
  if (enable) {
    oscNode = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscNode.frequency.value = 200;
    oscNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscNode.start(audioContext.currentTime);
  } else oscNode.stop(audioContext.currentTime);
}

function main() {
  let time = 0;
  CANVAS = initializeCanvas("myCanvas", SIZE, SIZE);
  initializeCamera();
  var ctx = CANVAS.getContext("2d");
  setInterval(function () {
    //time = time > SIZE ? time : time + 1;
    if (!isEffectEnabled || time > SIZE) {
      time = 0;
    } else time++;
    drawScene(ctx, time);
  }, 10); // once every 100 ms
}

function toggleRecording() {
  isEffectEnabled = !isEffectEnabled;

  if (!isPlaying) {
    playSound(1);
    isPlaying = true;
  } else {
    playSound(0);
    isPlaying = false;
  }
}

function nextEffect() {
  EFFECT_INDEX++;
  if (EFFECT_INDEX >= EFFECTS.length) {
    EFFECT_INDEX = 0;
  }
}

function initializeCanvas(canvasName, width, height) {
  let canvas = document.getElementById(canvasName);
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawScene(ctx, time) {
  if (VIDEO != null) {
    var min = Math.min(VIDEO.videoWidth, VIDEO.videoHeight);
    var sx = (VIDEO.videoWidth - min) / 2;
    var sy = (VIDEO.videoHeight - min) / 2;
    ctx.drawImage(VIDEO, sx, sy, min, min, 0, 0, SIZE, SIZE);
    applySomeEffect(ctx);
    applyRecording(ctx, time);
  } else {
    // show loading
  }
}

function applyRecording(ctx, time) {
  const imgData = ctx.getImageData(0, 0, SIZE, SIZE);
  const data = imgData.data;

  if (time === 0) return;

  let y;
  for (y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (time === y) {
        BUFFER[(y * SIZE + x) * 4 + 0] = data[(y * SIZE + x) * 4 + 0];
        BUFFER[(y * SIZE + x) * 4 + 1] = data[(y * SIZE + x) * 4 + 1];
        BUFFER[(y * SIZE + x) * 4 + 2] = data[(y * SIZE + x) * 4 + 2];
      }
    }
  }

  for (y = 0; y < time; y++) {
    for (let x = 0; x < SIZE; x++) {
      data[(y * SIZE + x) * 4 + 0] = BUFFER[(y * SIZE + x) * 4 + 0];
      data[(y * SIZE + x) * 4 + 1] = BUFFER[(y * SIZE + x) * 4 + 1];
      data[(y * SIZE + x) * 4 + 2] = BUFFER[(y * SIZE + x) * 4 + 2];
    }
  }

  for (let x = 0; x < SIZE; x++) {
    data[(y * SIZE + x) * 4 + 0] = 255;
    data[(y * SIZE + x) * 4 + 1] = 0;
    data[(y * SIZE + x) * 4 + 2] = 0;
  }

  ctx.putImageData(imgData, 0, 0);
}

function applySomeEffect(ctx) {
  switch (EFFECTS[EFFECT_INDEX]) {
    case "normal":
      break;
    case "gray":
      applyGrayScale(ctx);
      break;
    case "invert":
      applyColorInvert(ctx);
      break;
    case "symmetry":
      applySymmetry(ctx);
      break;
    case "mirror":
      applyMirroring(ctx);
      break;
    case "averageSymmetry":
      applyAverageSymmetry(ctx);
      break;
    case "stack":
      applyColorInvert(ctx);
      applySymmetry(ctx);
      break;
  }

  // ctx.fillStyle = "black";
  // ctx.textAlign = "center";
  // ctx.beginPath();
  // ctx.font = SIZE * 0.1 + "px Arial";
  // ctx.fillText(EFFECTS[EFFECT_INDEX], SIZE / 2, SIZE * 0.1);
}

function applyAverageSymmetry(ctx) {
  var imgData = ctx.getImageData(0, 0, SIZE, SIZE);
  var data = imgData.data;
  for (var y = 0; y < SIZE; y++) {
    /*
		x :      SIZE/2 ... SIZE
		SIZE-x:  SIZE/2 ... 0
		*/
    for (var x = 0; x < SIZE; x++) {
      var pixelLeft = getPixelValue(data, SIZE - x - 1, y);
      var pixelRight = getPixelValue(data, x, y);

      data[(y * SIZE + x) * 4 + 0] = (pixelLeft.red + pixelRight.red) / 2;
      data[(y * SIZE + x) * 4 + 1] = (pixelLeft.green + pixelRight.green) / 2;
      data[(y * SIZE + x) * 4 + 2] = (pixelLeft.blue + pixelRight.blue) / 2;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function applyMirroring(ctx) {
  var imgData = ctx.getImageData(0, 0, SIZE, SIZE);
  var data = imgData.data;
  for (var y = 0; y < SIZE; y++) {
    for (var x = 0; x < SIZE / 2; x++) {
      var pixelRight = getPixelValue(data, SIZE - x - 1, y);
      var pixelLeft = getPixelValue(data, x, y);

      //swap
      var aux = pixelRight;
      pixelRight = pixelLeft;
      pixelLeft = aux;

      data[(y * SIZE + x) * 4 + 0] = pixelLeft.red;
      data[(y * SIZE + x) * 4 + 1] = pixelLeft.green;
      data[(y * SIZE + x) * 4 + 2] = pixelLeft.blue;

      data[(y * SIZE + (SIZE - x)) * 4 + 0] = pixelRight.red;
      data[(y * SIZE + (SIZE - x)) * 4 + 1] = pixelRight.green;
      data[(y * SIZE + (SIZE - x)) * 4 + 2] = pixelRight.blue;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function applySymmetry(ctx) {
  var imgData = ctx.getImageData(0, 0, SIZE, SIZE);
  var data = imgData.data;
  for (var y = 0; y < SIZE; y++) {
    /*
		x :      SIZE/2 ... SIZE
		SIZE-x:  SIZE/2 ... 0
		*/
    for (var x = SIZE / 2; x < SIZE; x++) {
      var pixel = getPixelValue(data, SIZE - x, y);

      data[(y * SIZE + x) * 4 + 0] = pixel.red;
      data[(y * SIZE + x) * 4 + 1] = pixel.green;
      data[(y * SIZE + x) * 4 + 2] = pixel.blue;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function applyColorInvert(ctx) {
  var imgData = ctx.getImageData(0, 0, SIZE, SIZE);
  var data = imgData.data;
  for (var y = 0; y < SIZE; y++) {
    for (var x = 0; x < SIZE; x++) {
      var pixel = getPixelValue(data, x, y);

      data[(y * SIZE + x) * 4 + 0] = 255 - pixel.red;
      data[(y * SIZE + x) * 4 + 1] = 255 - pixel.green;
      data[(y * SIZE + x) * 4 + 2] = 255 - pixel.blue;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function applyGrayScale(ctx) {
  var imgData = ctx.getImageData(0, 0, SIZE, SIZE);
  var data = imgData.data;
  for (var y = 0; y < SIZE; y++) {
    for (var x = 0; x < SIZE; x++) {
      var pixel = getPixelValue(data, x, y);

      var avg = (pixel.red + pixel.green + pixel.blue) / 3;

      data[(y * SIZE + x) * 4 + 0] = avg;
      data[(y * SIZE + x) * 4 + 1] = avg;
      data[(y * SIZE + x) * 4 + 2] = avg;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function getPixelValue(data, x, y) {
  return {
    red: data[(y * SIZE + x) * 4 + 0],
    green: data[(y * SIZE + x) * 4 + 1],
    blue: data[(y * SIZE + x) * 4 + 2],
    alpha: data[(y * SIZE + x) * 4 + 3],
  };
}

function initializeCamera() {
  var promise = navigator.mediaDevices.getUserMedia({ video: true });
  promise
    .then(function (signal) {
      VIDEO = document.createElement("video");
      VIDEO.srcObject = signal;
      VIDEO.play();
    })
    .catch(function (err) {
      alert("Camera Error");
    });
}

main();
