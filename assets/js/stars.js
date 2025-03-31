const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const basketHeight = 30;
const basketWidth = 50;
let basketX = (canvas.width - basketWidth) / 4;
const basketY = canvas.height - basketHeight - 10;
const basketSpeed = 60;
let score = 0;
const fallingObjects = [];
const objectRadius = 14;
const objectSpeed = 4;
const spawnInterval = 1000; // Milliseconds

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function createFallingObject() {
  const x = getRandom(objectRadius, canvas.width - objectRadius);
  const y = -objectRadius;
  fallingObjects.push({ x, y, radius: objectRadius });
}

function drawFallingObject(object) {
  ctx.fillStyle = 'gold';
  const spikes = 5;
  const outerRadius = object.radius;
  const innerRadius = object.radius / 2;
  let rot = (Math.PI / 2) * 3;
  let x = object.x;
  let y = object.y;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(x, y - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = object.x + Math.cos(rot) * outerRadius;
    y = object.y + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = object.x + Math.cos(rot) * innerRadius;
    y = object.y + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(object.x, object.y - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function drawBasket() {
  ctx.fillStyle = 'saddlebrown'; // A richer brown color
  const cornerRadius = 8;
  ctx.beginPath();
  ctx.moveTo(basketX + cornerRadius, basketY);
  ctx.lineTo(basketX + basketWidth - cornerRadius, basketY);
  ctx.arcTo(
    basketX + basketWidth,
    basketY,
    basketX + basketWidth,
    basketY + cornerRadius,
    cornerRadius
  );
  ctx.lineTo(basketX + basketWidth, basketY + basketHeight - cornerRadius);
  ctx.arcTo(
    basketX + basketWidth,
    basketY + basketHeight,
    basketX + basketWidth - cornerRadius,
    basketY + basketHeight,
    cornerRadius
  );
  ctx.lineTo(basketX + cornerRadius, basketY + basketHeight);
  ctx.arcTo(
    basketX,
    basketY + basketHeight,
    basketX,
    basketY + basketHeight - cornerRadius,
    cornerRadius
  );
  ctx.lineTo(basketX, basketY + cornerRadius);
  ctx.arcTo(basketX, basketY, basketX + cornerRadius, basketY, cornerRadius);
  ctx.closePath();
  ctx.fill();
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();

  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    const object = fallingObjects[i];
    object.y += objectSpeed;
    drawFallingObject(object);

    // Check for collision with basket
    if (
      object.y + object.radius > basketY &&
      object.y - object.radius < basketY + basketHeight &&
      object.x + object.radius > basketX &&
      object.x - object.radius < basketX + basketWidth
    ) {
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
      fallingObjects.splice(i, 1); // Remove caught object
    } else if (object.y > canvas.height + object.radius) {
      fallingObjects.splice(i, 1); // Remove object that went off-screen
    }
  }

  requestAnimationFrame(updateGame);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    basketX = Math.max(0, basketX - basketSpeed);
  } else if (e.key === 'ArrowRight') {
    basketX = Math.min(canvas.width - basketWidth, basketX + basketSpeed);
  }
});

setInterval(createFallingObject, spawnInterval);
updateGame();
