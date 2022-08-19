import { Game } from "./game.js";

// HTML elements.
const startBtn = document.getElementById("startBtn");
const gameBoard = document.getElementById("board");

const game = new Game(gameBoard);
startBtn.addEventListener("click", (e) => {
    e.currentTarget.innerText = "Restart";
    game.start();
});
