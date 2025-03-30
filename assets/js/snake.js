const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const grid = 16;
let count = 0;
let score = 0;
let snake = {
  x: 320,
  y: 320,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4,
};
let apples = [];
const numberOfApples = 5;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateApple() {
  return {
    x: getRandomInt(0, canvas.width / grid) * grid,
    y: getRandomInt(0, canvas.height / grid) * grid,
  };
}

function initializeApples() {
  apples = [];
  for (let i = 0; i < numberOfApples; i++) {
    apples.push(generateApple());
  }
}

initializeApples();
updateScoreDisplay(); // Initialize the score display

function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function loop() {
  requestAnimationFrame(loop);
  if (++count < 4) {
    return;
  }
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Keep snake within canvas boundaries (wrapping)
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw apples and check for collision
  ctx.fillStyle = 'red';
  snake.cells.forEach(function (cell) {
    apples.forEach((apple, index) => {
      ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        apples.splice(index, 1);
        apples.push(generateApple());
        score += 10; // Increment the score
        updateScoreDisplay(); // Update the score display
      }
    });
  });

  // Draw snake
  ctx.fillStyle = 'green';
  snake.cells.forEach(function (cell, index) {
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    // Check for collision with own body
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        // Game over - reset
        snake.x = canvas.width / 2 - grid / 2;
        snake.y = canvas.height / 2 - grid / 2;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        score = 0; // Reset the score
        updateScoreDisplay(); // Update the score display
        initializeApples();
      }
    }
  });
}

document.addEventListener('keydown', function (e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);
