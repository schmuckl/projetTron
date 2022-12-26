// Utilisé pour la gestion de la grille où se déplacent les motos
console.log("HELLO");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class TronPart {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

let speed = 5;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
  
let headX = 10;
let headY = 10;
const tronParts = [];
let tailLength = 2;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

//game loop
function drawGame() {
    xVelocity = inputsXVelocity;
    yVelocity = inputsYVelocity;
  
    changeTronPosition();
    let result = isGameOver();
    if (result) {
      return;
    }
  
    clearScreen();
  
    TronGrow();
    
    drawTron();
    
    setTimeout(drawGame, 1000 / speed);
  }
  
  function isGameOver() {
    let gameOver = false;
  
    if (yVelocity === 0 && xVelocity === 0) {
      return false;
    }
  
    //walls
    if (headX < 0) {
      gameOver = true;
    } else if (headX === tileCount) {
      gameOver = true;
    } else if (headY < 0) {
      gameOver = true;
    } else if (headY === tileCount) {
      gameOver = true;
    }
  
    //TronCollision
    for (let i = 0; i < tronParts.length; i++) {
      let part = tronParts[i];
      if (part.x === headX && part.y === headY) {
        gameOver = true;
        break;
      }
    }
  
    if (gameOver) {
      ctx.fillStyle = "white";
      ctx.font = "50px Verdana";
  
      if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
  
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        // Fill with gradient
        ctx.fillStyle = gradient;
  
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
      }
  
      ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }
  
    return gameOver;
  }
  
  
  function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawTron() {
    ctx.fillStyle = "green";
    for (let i = 0; i < tronParts.length; i++) {
      let part = tronParts[i];
      ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
  
    tronParts.push(new TronPart(headX, headY)); //put an item at the end of the list next to the head
    while (tronParts.length > tailLength) {
        tronParts.shift(); // remove the furthet item from the tron parts if have more than our tail size.
    }
  
    ctx.fillStyle = "orange";
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
  }
  
  function changeTronPosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
  }
  
  function TronGrow() {
      tailLength++;
  }
  
  document.body.addEventListener("keydown", keyDown);
  
  function keyDown(event) {
    //up
    if (event.keyCode == 38 || event.keyCode == 87) {
      //87 is w
      if (inputsYVelocity == 1) return;
      inputsYVelocity = -1;
      inputsXVelocity = 0;
    }
  
    //down
    if (event.keyCode == 40 || event.keyCode == 83) {
      // 83 is s
      if (inputsYVelocity == -1) return;
      inputsYVelocity = 1;
      inputsXVelocity = 0;
    }
  
    //left
    if (event.keyCode == 37 || event.keyCode == 65) {
      // 65 is a
      if (inputsXVelocity == 1) return;
      inputsYVelocity = 0;
      inputsXVelocity = -1;
    }
  
    //right
    if (event.keyCode == 39 || event.keyCode == 68) {
      //68 is d
      if (inputsXVelocity == -1) return;
      inputsYVelocity = 0;
      inputsXVelocity = 1;
    }
  }
  
  drawGame();