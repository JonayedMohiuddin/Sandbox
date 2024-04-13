const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isPlaying = true;
let isDebugMode = true;
let isGridVisible = true;
let isWorldBoundaries = false;

let pressedKey = null;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let cellSize = 5;
let rows = Math.floor(canvasHeight / cellSize);
let columns = Math.floor(canvasWidth / cellSize);
let grid = Array(columns)
    .fill()
    .map(() => Array(rows).fill(0));

const ItemEmpty = 0;
const ItemStone = 1;
const ItemSand = 2;
const ItemWater = 3;
let currentItem = ItemSand;

let isMouseDown = false;
let isMouseLeftDown = 0;
let mx, my;

canvas.addEventListener("click", (e) => {
    isMouseLeftDown = e.button === 0;
    mx = e.offsetX;
    my = e.offsetY;
    cellClicked(e.offsetX, e.offsetY);
});

canvas.addEventListener("contextmenu", (e) => {
    isMouseLeftDown = false;
    mx = e.offsetX;
    my = e.offsetY;
    cellClicked(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    isMouseLeftDown = e.button === 0;
    mx = e.offsetX;
    my = e.offsetY;
    cellClicked(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
});

document.addEventListener("mouseup", (e) => {
    isMouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        mx = e.offsetX;
        my = e.offsetY;
        cellClicked(e.offsetX, e.offsetY);
    }
});

addEventListener("keydown", (e) => {
    console.log("keydown ", e.key);
    let key = e.key.toLowerCase();

    if (key === "s") {
        currentItem = ItemSand;
    }
    if (key === "r") {
        currentItem = ItemStone;
    }
    if (key === "e") {
        currentItem = ItemEmpty;
    }
    if (key === "w") {
        currentItem = ItemWater;
    }
    if (key === "g") {
        isGridVisible = !isGridVisible;
    }
    if (key === "c") {
        clearGrid();
    }
    if (key === "p") {
        isPlaying = !isPlaying;
    }
    if (key === "d") {
        isDebugMode = !isDebugMode;
    }
    if(key === "b"){
        isWorldBoundaries = !isWorldBoundaries;
    }
});

addEventListener("keyup", (e) => {
    console.log("keyup ", e.key);
    pressedKey = null;
});

function coordToCell(x, y) {
    return [Math.floor(x / cellSize), Math.floor(y / cellSize)];
}

function isValidCell(x, y) {
    return x >= 0 && x < columns && y >= 0 && y < rows;
}

function cellClicked(coordX, coordY) {
    let [x, y] = coordToCell(coordX, coordY);
    if (!isValidCell(x, y)) return;
    if (isDebugMode) console.log(x, y, isMouseLeftDown);

    if (isMouseLeftDown) {
        grid[x][y] = currentItem;
    }
}

function drawGrid() {
    ctx.strokeStyle = "rgba(100, 100, 100, 50)";
    ctx.beginPath();
    ctx.lineWidth = 1;
    for (let x = 1; x < columns; x++) {
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, canvasHeight);
    }
    for (let y = 1; y < rows; y++) {
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(canvasWidth, y * cellSize);
    }

    ctx.stroke();
}

function drawCells() {
    // let newGrid = [];
    // for (let x = 0; x < columns; x++) {
    //     newGrid.push(grid[x].slice());
    // }

    if(isMouseDown && isMouseLeftDown) {
        cellClicked(mx, my);
    }

    let newGrid = Array(columns)
        .fill()
        .map(() => Array(rows).fill(ItemEmpty));

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y] === ItemEmpty) {
                ctx.fillStyle = "white";
            } else if (grid[x][y] === ItemStone) {
                ctx.fillStyle = "gray";
                newGrid[x][y] = ItemStone;
            } else if (grid[x][y] === ItemSand) {
                ctx.fillStyle = "yellow";

                if (isValidCell(x, y + 1) && grid[x][y + 1] === ItemEmpty) {
                    newGrid[x][y + 1] = ItemSand;
                } else if (y + 1 === rows && !isWorldBoundaries) {
                } else if (isValidCell(x - 1, y + 1) && grid[x - 1][y + 1] === ItemEmpty) {
                    newGrid[x - 1][y + 1] = ItemSand;
                } else if (isValidCell(x + 1, y + 1) && grid[x + 1][y + 1] === ItemEmpty) {
                    newGrid[x + 1][y + 1] = ItemSand;
                } else {
                    newGrid[x][y] = ItemSand;
                }
            } else if (grid[x][y] === ItemWater) {
                ctx.fillStyle = "blue";
            }

            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    if (isPlaying) {
        grid = newGrid;
    }
}

function clearGrid() {
    grid = Array(columns)
        .fill()
        .map(() => Array(rows).fill(0));
}

function clearScreen() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function draw() {
    clearScreen();
    drawCells();
    if (isGridVisible) {
        drawGrid();
    }
}

setInterval(draw, 40);
