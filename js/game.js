import { WINNING_COMBINATIONS, SYMBOLS } from "./constants.js";

export class Game {
    /**
     * @type {NodeListOf<HTMLDivElement>}
     */
    cellElements;
    /**
     * @type {HTMLButtonElement}
     */
    msgEl;
    /**
     * @type {"x" | "o" | null}
     */
    winningSymbol = null;
    /**
     * @type {[key: number, value: string][]}
     *
     * @description Game board data. This represents what's inside the cells.
     */
    board = [];
    circleTurn = false;
    gameOver = false;

    /**
     *
     * @param {HTMLDivElement} gameBoard
     */
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.cellElements = document.querySelectorAll("[data-cell]");
        this.msgEl = document.getElementById("msg");
        this.setBoard();
    }

    /**
     * Start the game
     */
    start() {
        // Prepare the game board (HTML).
        this.gameBoard.classList.remove("hidden");
        this.gameBoard.classList.add("board");
        // Reset display message.
        this.msgEl.innerText = "";
        // Set the next symbol.
        this.scaffoldSymbols();
        // Update/reset the game board data.
        this.setBoard();
        this.gameOver = false;
        this.circleTurn = false;
        this.winningSymbol = null;
        // Add a event listener to the cells.
        this.cellElements.forEach((el, i) => {
            el.classList.remove("set");
            el.removeEventListener("click", (e) => this.handleSelectCell(e, i));
            el.addEventListener("click", (e) => this.handleSelectCell(e, i));
        });
    }

    /**
     * @private
     *
     * Set up/reset game board data.
     */
    setBoard() {
        this.board = [];
        for (let i = 0; i < 9; i++) {
            this.board.push([i, ""]);
        }
    }

    /**
     * @private
     * @type {(e: MouseEvent) => void}
     *
     * Handle click/select game board cell. This will then update the game board data and HTML cell element to represent the selected symbol.
     */
    handleSelectCell(e, i) {
        if (!this.board[i][1]) {
            // If the selected cell doesn't have a symbol then add a symbol.
            const symbol = this.circleTurn ? SYMBOLS.o : SYMBOLS.x;
            this.board[i][1] = symbol;
            e.currentTarget.dataset.cell = symbol;
            e.currentTarget.classList.add("set");
            // Change the turn
            this.circleTurn = !this.circleTurn;
            this.scaffoldSymbols();
            // Find the winner.
            this.matchWinningCombinations();
        }

        if (this.gameOver) {
            if (this.winningSymbol) {
                // If the game find an winner then show a winning message.
                this.msgEl.innerText = this.winningSymbol.toUpperCase() + " wins!";
            } else {
                // Show game over if all the cells are booked.
                this.msgEl.innerText = "No one wins!";
            }
        }
    }

    /**
     * @private
     */
    scaffoldSymbols() {
        this.cellElements.forEach((el) => {
            el.dataset.cellHover = this.circleTurn ? SYMBOLS.o : SYMBOLS.x;
        });
    }

    /**
     * @private
     */
    matchWinningCombinations() {
        WINNING_COMBINATIONS.forEach((cmb) => {
            // Get all the cells from the game board.
            const matches = [];
            cmb.forEach((i) => {
                matches.push(this.board[i][1]);
            });
            // Match all the cells symbols.
            if (matches[0] === SYMBOLS.x && matches[1] === SYMBOLS.x && matches[2] === SYMBOLS.x) {
                console.log("X Wins");
                this.winningSymbol = SYMBOLS.x;
                this.gameOver = true;
                return;
            } else if (matches[0] === SYMBOLS.o && matches[1] === SYMBOLS.o && matches[2] === SYMBOLS.o) {
                console.log("O Wins");
                this.winningSymbol = SYMBOLS.o;
                this.gameOver = true;
                return;
            }
        });

        // Find if all the cells are booked or not.
        let filledCells = 0;
        this.board.forEach((cel) => {
            if (cel[1]) {
                filledCells++;
            }
        });
        if (filledCells === 9) {
            this.gameOver = true;
        }
    }
}
