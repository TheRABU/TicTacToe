const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const SYMBOLS = {
    x: "x",
    o: "o",
};

const startBtn = document.getElementById("startBtn");
const gameBoard = document.getElementById("board");

class Game {
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
     */
    board = [];
    circleTurn = false;
    gameOver = false;

    /**
     *
     * @param {HTMLButtonElement} startBtn
     */
    constructor() {
        this.cellElements = document.querySelectorAll("[data-cell]");
        this.msgEl = document.getElementById("msg");
        this.setBoard();
    }

    start() {
        gameBoard.classList.remove("hidden");
        gameBoard.classList.add("board");
        this.msgEl.innerText = "";
        this.scaffoldSymbols();
        this.setBoard();
        this.gameOver = false;
        this.circleTurn = false;
        this.winningSymbol = null;
        this.cellElements.forEach((el, i) => {
            el.classList.remove("set");
            el.addEventListener("click", (e) => this.handleSelectCell(e, i));
        });
    }

    /**
     * @private
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
     */
    handleSelectCell(e, i) {
        if (!this.board[i][1]) {
            const symbol = this.circleTurn ? SYMBOLS.o : SYMBOLS.x;
            this.board[i][1] = symbol;
            e.currentTarget.dataset.cell = symbol;
            e.currentTarget.classList.add("set");
            this.circleTurn = !this.circleTurn;
            this.scaffoldSymbols();
            this.matchWinningCombinations();
        }

        if (this.gameOver) {
            if (this.winningSymbol) {
                this.msgEl.innerText = this.winningSymbol.toUpperCase() + " wins!";
            } else {
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
            const matches = [];
            cmb.forEach((i) => {
                matches.push(this.board[i][1]);
            });
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

const game = new Game();
startBtn.addEventListener("click", (e) => {
    e.currentTarget.innerText = "Restart";
    game.start();
});
