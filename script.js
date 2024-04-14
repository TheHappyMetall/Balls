const isTouchDevice = !!("ontouchstart" in window || navigator.maxTouchPoints);

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const canvasColor = "#363636";
const ballColors = ["#4b4b4b", "#98c15e", "#cde735"];
const fontColor = "#808080";
const myFontStyle = "16px Tahoma";

let balls = [];

let ballsSpamInterval;

// Классы
class Ball {
  constructor(
    x,
    y,
    radius = 16,
    vx = getRandomInt(-6, 6),
    vy = -12,
    color = ballColors[getRandomInt(0, ballColors.length)]
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
  }
}

// Слушатели
if (!isTouchDevice) {
  canvas.addEventListener("click", (e) => {
    ballOneFunc(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousedown", (e) => {
    ballsSpamInterval = setInterval(() => {
      ballSpamFunc(e.offsetX, e.offsetY);
    }, 400);
  });
  canvas.addEventListener("mouseup", () => {
    clearInterval(ballsSpamInterval);
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      ExplosFunc();
    }
  });
} else {
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      ballOneFunc(touch.clientX, touch.clientY);

      ballsSpamInterval = setInterval(() => {
        ballSpamFunc(touch.clientX, touch.clientY);
      }, 400);
    }
  });

  canvas.addEventListener("touchend", (e) => {
    console.log(e.changedTouches);
    clearInterval(ballsSpamInterval);
  });

  mobileSpawnSpace().addEventListener("click", () => {
    ExplosFunc();
  });
}

//
requestAnimationFrame(loop);
//

//   Функции
function loop() {
  // Подготовка
  setCanvas();

  balls.forEach((ball) => {
    // Рисование
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Движение
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Коллизии стен и шаров
    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
      ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
      ball.vx = -ball.vx;
    }

    // Гравитация шаров
    if (ball.y > canvas.height - ball.radius === false) {
      ball.vy *= 0.99;
      ball.vy += 0.25;
    }
  });

  requestAnimationFrame(loop);
}

function getRandomInt(min, max) {
  // Максимум и минимум включаются
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  setText();
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fill();
}

function setText() {
  ctx.fillStyle = fontColor;
  ctx.font = myFontStyle;
  ctx.fillText("Нажатие: один шар", 5, 20);
  ctx.fillText("Удержание: группа шаров", 5, 40);
  ctx.fillText("Space: взрыв", 5, 60);
}

function mobileSpawnSpace() {
  const mobileSpaceBtn = document.createElement("div");
  mobileSpaceBtn.className = "mobile-space-btn";
  mobileSpaceBtn.innerHTML = "Space";
  document.body.append(mobileSpaceBtn);

  return mobileSpaceBtn;
}

// Взаимодействие с шарами
function ballOneFunc(x, y) {
  balls.push(new Ball(x, y));
}

function ballSpamFunc(x, y) {
  for (i = 0; i < 6; i++) {
    balls.push(new Ball(x, y));
  }
}
function ExplosFunc() {
  balls.forEach((ball) => {
    ball.vx = getRandomInt(-6, 6);
    ball.vy = getRandomInt(-10, -25);
  });
}
