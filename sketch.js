const TS = 32; // tile size

/*
TILE LEGEND
0 = floor
1 = wall
2 = goal (finish tile)
*/
const LEVELS = [
  {
    name: "Level 1",
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,1,0,0,2,1],
      [1,0,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    playerStart: { r: 1, c: 1 },
  },

  // BONUS: second level (different layout)
  {
    name: "Level 2",
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1,0,0,0,2,1],
      [1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
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

      if (t === 1) fill(30, 50, 60);      // wall
      else if (t === 2) fill(80, 180, 120); // goal
      else fill(230);                      // floor

      rect(c * TS, r * TS, TS, TS);
    }
  }

  // draw player
  fill(60, 90, 220);
  rect(player.c * TS + 6, player.r * TS + 6, TS - 12, TS - 12, 6);

  // HUD text
  fill(0);
  text(`${LEVELS[levelIndex].name}  (use arrow keys)`, 10, 16);

  if (won) {
    text("✅ Level complete! Loading next...", 10, 36);
  }
}

// move on key press (simple collision vs walls)
function keyPressed() {
  if (won) return;

  let dr = 0, dc = 0;
  if (keyCode === UP_ARROW) dr = -1;
  if (keyCode === DOWN_ARROW) dr = 1;
  if (keyCode === LEFT_ARROW) dc = -1;
  if (keyCode === RIGHT_ARROW) dc = 1;

  if (dr === 0 && dc === 0) return;

  const nr = player.r + dr;
  const nc = player.c + dc;

  // bounds check
  if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;

  // wall collision
  if (grid[nr][nc] === 1) return;

  // move
  player.r = nr;
  player.c = nc;

  // win condition: step on goal tile (2)
  if (grid[nr][nc] === 2) {
    won = true;

    // BONUS: auto-load next level after a short delay
    setTimeout(() => {
      const next = levelIndex + 1;
      if (next < LEVELS.length) loadLevel(next);
      else {
        // no more levels: reset or show end state
        loadLevel(0);
      }
    }, 800);
  }
}

function loadLevel(i) {
  levelIndex = i;
  grid = LEVELS[levelIndex].grid;

  // reset player
  player.r = LEVELS[levelIndex].playerStart.r;
  player.c = LEVELS[levelIndex].playerStart.c;

  won = false;
}

