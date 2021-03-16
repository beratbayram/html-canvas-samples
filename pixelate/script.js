const SIZE = 1000;
const FPS = 60;

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(position) {
    this.x += position.x;
    this.y += position.y;
    return this;
  }

  multiply(int) {
    this.x *= int;
    this.y *= int;

    return this;
  }

  clone() {
    return new Position(this.x, this.y);
  }

  set(position) {
    this.x = position.x;
    this.y = position.y;

    return this;
  }

  reverseX() {
    this.x = -this.x;
    return this;
  }
  reverseY() {
    this.y = -this.y;
    return this;
  }
}

class Ball {
  constructor() {
    this.pos = new Position(SIZE/2, SIZE-100);
    this.defPos = this.pos.clone();
    this.color = "red";
    this.speed = new Position(-3, -2).multiply(2);
    this.radius = 10;
  }

  move() {
    this.pos.add(this.speed);
    if (this.pos.x < this.radius * 2) {
      this.speed.reverseX();
      this.pos.set(new Position(20, this.pos.y));

    }
    if (SIZE - this.radius * 2 < this.pos.x) {
      this.speed.reverseX();
      this.pos.set(new Position(SIZE - 20, this.pos.y));

    }
    if (this.pos.y < this.radius) {
      this.speed.reverseY();
      this.pos.set(new Position(this.pos.x, 20));
    }
    if (SIZE + this.radius < this.pos.y) {
      this.speed.reverseY();
      this.pos.set(this.defPos);
    }

    return this;
  }
}

class Paddle {
  constructor() {
    this.width = 250;
    this.height = 25;
    this.speed = 25;
    this.color = "orange";
    this.pos = new Position(SIZE / 2 - this.width / 2, SIZE - 2 * this.height);

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a") this.goLeft();
      else if (event.key === "ArrowRight"|| event.key === "d") this.goRight();
    });
  }

  ballHit(ball) {
    const leftX = this.pos.x - ball.radius * 1.5;
    const rightX = this.pos.x + this.width + ball.radius * 1.5;
    const upY = this.pos.y - ball.radius * 1.5;
    // const downY = this.pos.y + this.height + ball.radius;

    if (leftX < ball.pos.x && ball.pos.x < rightX && upY < ball.pos.y) {
      ball.speed.reverseY();
      ball.pos.y = upY;
    }
    return this;
  }

  goLeft() {
    if (0 < this.pos.x) this.pos.x -= this.speed;
  }
  goRight() {
    if (this.pos.x < SIZE - this.width) this.pos.x += this.speed;
  }
}

class Board {
  constructor(img) {
    this.pixelArr = getPixelArr(img);
    this.boxSize = Math.round(
      SIZE / Math.max(this.pixelArr.length, this.pixelArr[0].length)
    );
  }

  _hitPoint(coordinates) {
    const point = {
      x: Math.round(coordinates.x / this.boxSize - 0.5),
      y: Math.round(coordinates.y / this.boxSize - 0.5),
    };
    if (
      point.y < this.pixelArr.length &&
      point.x < this.pixelArr[0].length &&
      this.pixelArr[point.y][point.x].a !== 0
    ) {
      this.pixelArr[point.y][point.x].a = 0;
      return true;
    }
    return false;
  }

  ballHit(ball) {
    const center = {
      x: ball.pos.x,
      y: ball.pos.y,
    };
    this._hitPoint(center);
    const right = {
      x: ball.pos.x + ball.radius,
      y: ball.pos.y,
    };
    if (this._hitPoint(right)) ball.speed.reverseX();

    const left = {
      x: ball.pos.x - ball.radius,
      y: ball.pos.y,
    };
    if (this._hitPoint(left)) ball.speed.reverseX();

    const up = {
      x: ball.pos.x,
      y: ball.pos.y - ball.radius,
    };
    if (this._hitPoint(up)) ball.speed.reverseY();

    const down = {
      x: ball.pos.x,
      y: ball.pos.y + ball.radius,
    };
    if (this._hitPoint(down)) ball.speed.reverseY();
  }
}

document.body.onload = () => {
  const canvas = document.getElementById("mainCanvas");
  const ctx = canvas.getContext("2d");
  const imgURL =
    "https://images.unsplash.com/photo-1590518226506-4c9b077392cc?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=751&q=80";

  canvas.width = SIZE;
  canvas.height = SIZE;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgURL;

  img.onload = () => {
    const board = new Board(img);
    const ball = new Ball();
    const paddle = new Paddle();
    setInterval(drawScene, 1000 / FPS, ctx, board, ball, paddle);
  };
};

function drawScene(ctx, board, ball, paddle) {
  board.ballHit(ball, ctx);
  const pixelArr = board.pixelArr;
  const boxSize = board.boxSize;

  ctx.save();
  ctx.clearRect(0, 0, SIZE, SIZE);

  pixelArr.forEach((row, y) => {
    row.forEach((color, x) => {
      drawBox(ctx, x, y, boxSize, color);
    });
  });

  drawPaddle(ctx, paddle.ballHit(ball));
  drawBall(ctx, ball.move());

  ctx.restore();
}

function drawPaddle(ctx, paddle) {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.pos.x, paddle.pos.y, paddle.width, paddle.height);
}

function drawBall(ctx, ball) {
  ctx.beginPath();
  ctx.fillStyle = ball.color;
  ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function drawBox(ctx, x, y, boxSize, color) {
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
  ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
}

function getPixelArr(img) {
  const canvas = document.getElementById("bufferCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.height = img.height / 10;
  canvas.width = img.width / 10;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  canvas.height = img.height;
  canvas.width = img.width;

  const size = 0.1;
  const w = canvas.width * size;
  const h = canvas.height * size;

  ctx.drawImage(img, 0, 0, w, h);
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imgData.data;
  const tolerance = 55;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const pixel = getPixelValue(data, canvas.width, x, y);

      if (
        x > canvas.width - 1 / size || // prevent alignment issues
        y > canvas.height - 1 / size ||
        (pixel.red >= 255 - tolerance &&
          pixel.green >= 255 - tolerance &&
          pixel.blue >= 255 - tolerance)
      ) {
        // remove pixel
        data[(y * canvas.width + x) * 4 + 0] = 0;
        data[(y * canvas.width + x) * 4 + 1] = 0;
        data[(y * canvas.width + x) * 4 + 2] = 0;
        data[(y * canvas.width + x) * 4 + 3] = 0;
      } else {
        data[(y * canvas.width + x) * 4 + 3] = 255;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const result = [];

  for (let y = 0; y < canvas.height; y += 1 / size) {
    const element = [];
    for (let x = 0; x < canvas.width; x += 1 / size) {
      const pixel = getPixelValue(data, canvas.width, x, y);
      element.push({
        r: pixel.red,
        g: pixel.green,
        b: pixel.blue,
        a: pixel.alpha,
      });
    }
    result.push(element);
  }
  return result;
}

function getPixelValue(data, width, x, y) {
  return {
    red: data[(y * width + x) * 4 + 0],
    green: data[(y * width + x) * 4 + 1],
    blue: data[(y * width + x) * 4 + 2],
    alpha: data[(y * width + x) * 4 + 3],
  };
}
