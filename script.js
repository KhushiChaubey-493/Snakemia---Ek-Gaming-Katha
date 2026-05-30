const gameBoard = document.querySelector(".game-board");
const scoreBox = document.getElementById("scoreBox");
const highScoreBox = document.getElementById("highScoreBox");

// Game Constants and Variables
let inputDirection = { x: 0, y: 0 };
const foodSound = new Audio('music/foodSound.mp3');
const gameOverSound = new Audio('music/gameOverSound.mp3');
const moveSound = new Audio('music/moveSound.mp3');
const musicSound = new Audio('music/background.mp3');
let speed = 2;
let score = 0, highScoreValue = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {

    // If you bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {

    // Part 1: Updating the snake array & food
    if (isCollide(snakeArr)) {
        musicSound.pause();
        gameOverSound.play();
        inputDirection = { x: 0, y: 0 };
        alert("Game Over, Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
    }

    // If you have eaten the food, increment the score & regenerate the food

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > highScoreValue) {
            highScoreValue = score;
            localStorage.setItem("highScore", JSON.stringify(highScoreValue));
            highScoreBox.innerHTML = "High Score: " + highScoreValue;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDirection.x, y: snakeArr[0].y + inputDirection.y });

        let a = 2, b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        const element = snakeArr[i];
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDirection.x;
    snakeArr[0].y += inputDirection.y;

    // Part 2: Display the snake & food
    // Display the snake
    gameBoard.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        gameBoard.appendChild(snakeElement);
    })

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

//Main logics start from here

let highScore = localStorage.getItem("highScore");
if (highScore === null) {
    highScore = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreValue));
}
else {
    console.log(highScore);
    console.log(typeof highScore);
    highScoreValue = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScoreValue;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", e => {
    inputDirection = { x: 0, y: 1 } // Start the game
    musicSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case "ArrowDown":
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case "ArrowLeft":
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case "ArrowRight":
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        default:
            break;
    }
})