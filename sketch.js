const TS = 32; // tile size

/*
TILE LEGEND
0 = floor
1 = wall
2 = goal (finish tile)
3 = obstacle (blocks like a wall)
*/

const LEVELS = [
  {
    name: "Level 1",
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,2,1],
      [1,0,1,1,0,1,3,1,1,1,0,1,0,1,0,1],
      [1,0,1,3,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,3,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1],

      [1,0,0,1,3,0,0,1,0,3,0,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    playerStart: { r: 1, c: 1 },
  },

  {
    name: "Level 2",
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1,3,0,0,2,1],
      [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1],
      // obstacle inside the maze
      [1,0,1,3,1,1,3,1,3,1,1,1,0,1,3,1],
      [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    playerStart: { r: 1, c: 1 },
  }
];

// ---- game state ----
let levelIndex = 0;
let grid = null;
let player = { r: 1, c: 1 };
let won = false;
let gameOver = false;
let gameWin = false;

function resetLevelToStart() {
  player.r = LEVELS[levelIndex].playerStart.r;
  player.c = LEVELS[levelIndex].playerStart.c;
  won = false;
  gameOver = false;
}

function resetRunToLevel1() {
  loadLevel(0);       // sends you back to Level 1 start
  gameWin = false;
  gameOver = false;
}

function setup() {
  loadLevel(0);
  createCanvas(grid[0].length * TS, grid.length * TS);
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  background(240);

  // draw tiles from the CURRENT grid using loops (dynamic)
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const t = grid[r][c];

      if (t === 1) {
        fill(30, 50, 60); // wall
      } else if (t === 2) {
        fill(80, 180, 120); // goal
      } else if (t === 3) {
        fill(200, 80, 80); // obstacle
      } else {
        fill(230); // floor
      }

      rect(c * TS, r * TS, TS, TS);
    }
  }

  // draw player
  fill(60, 90, 220);
  rect(player.c * TS + 6, player.r * TS + 6, TS - 12, TS - 12, 6);

  // HUD text
  fill(0);
  textSize(14);
  textAlign(LEFT, BASELINE);
  text(`${LEVELS[levelIndex].name}  (use arrow keys)`, 10, 16);

  if (won) {
    text("✅ Level complete! Loading next...", 10, 36);
  }

  // FINAL WIN overlay
if (gameWin) {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(32);
  text("🎉 YOU WON!", width / 2, height / 2 - 20);

  textSize(16);
  text("Press R to play again", width / 2, height / 2 + 20);

  // restore HUD defaults
  textAlign(LEFT, BASELINE);
  textSize(14);
}


  // GAME OVER overlay (draws ON TOP — not blank)
  if (gameOver) {
    fill(0, 180);
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);

    textSize(32);
    text("GAME OVER", width / 2, height / 2 - 20);

    textSize(16);
    text("Press R to return to start", width / 2, height / 2 + 20);

    // restore HUD defaults
    textAlign(LEFT, BASELINE);
    textSize(14);
  }
}

function keyPressed() {
  // FINAL WIN screen: press R to restart run
  if (gameWin) {
    if (key === "r" || key === "R") resetRunToLevel1();
    return;
  }

  // GAME OVER screen: press R to restart current level
  if (gameOver) {
    if (key === "r" || key === "R") resetLevelToStart();
    return;
  }

  // Ignore movement while auto-loading next level
  if (won) return;

  let dr = 0, dc = 0;
  if (keyCode === UP_ARROW) dr = -1;
  else if (keyCode === DOWN_ARROW) dr = 1;
  else if (keyCode === LEFT_ARROW) dc = -1;
  else if (keyCode === RIGHT_ARROW) dc = 1;
  else return;

  const nr = player.r + dr;
  const nc = player.c + dc;

  // bounds check
  if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;

  // wall blocks movement
  if (grid[nr][nc] === 1) return;

  // obstacle triggers GAME OVER (do NOT move onto it)
  if (grid[nr][nc] === 3) {
    gameOver = true;
    return;
  }

  // move
  player.r = nr;
  player.c = nc;

  // goal tile: either go to next level or show final win
  if (grid[nr][nc] === 2) {
    won = true;

    setTimeout(() => {
      const next = levelIndex + 1;

      if (next < LEVELS.length) {
        loadLevel(next);      // Level 1 -> Level 2
      } else {
        gameWin = true;       // finished last level
      }

      won = false;            // clear loading state (either way)
    }, 800);
  }
}

function loadLevel(i) {
  levelIndex = i;
  grid = LEVELS[levelIndex].grid;

  player.r = LEVELS[levelIndex].playerStart.r;
  player.c = LEVELS[levelIndex].playerStart.c;

  won = false;
  gameOver = false;
  gameWin = false;
}
