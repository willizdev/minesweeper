function cloneBoard(arr) {
    return Array.from(arr, item => Array.isArray(item) ? cloneBoard(item) : item);
}

function createBoard() {
    let col = new Array();
    for (let i = 0; i < 10; i++) {
        let row = new Array();
        for (let j = 0; j < 10; j++) {
            row[j] = 0;
        }
        col.push(row);
    }
    return col;
}

function generateMines(board, mines) {
    function shuffle(arr) {
        for (let i = 0; i < arr.length; i++) {
            let rand = Math.floor(Math.random() * arr.length);
            let temp = arr[i];
            arr[i] = arr[rand];
            arr[rand] = temp;
       }
    }

    let index = new Array();
    for (let i = 0; i < 100; i++) {
        index[i] = i;
    }
    shuffle(index);

    for (let i = 0; i < mines; i++) {
        let w = index[i];
        board[parseInt(w / 10)][w % 10] = -1;
    }
}

function generateNumbers(board) {
    function isMine(board, i, j) {
        let cols = board.length;
        let rows = board[0].length;
        return i >= 0 && j >= 0 && i < cols && j < rows && board[i][j] == -1 ? 1 : 0;
    }

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] != -1) {
                let sum = isMine(board, i - 1, j - 1) + isMine(board, i - 1, j) + isMine(board, i - 1, j + 1)
                + isMine(board, i, j - 1) + isMine(board, i, j + 1) + isMine(board, i + 1, j - 1)
                + isMine(board, i + 1, j) + isMine(board, i + 1, j + 1);
                board[i][j] = sum;
            }
        }
    }
}

function emptySpace(board, numbers, i, j) {
    let cols = board.length;
    let rows = board[0].length;
    if (i >= 0 && j >= 0 && i < cols && j < rows && board[i][j] != -3) {
        if (numbers[i][j] == 0) {
            board[i][j] = -3;
            emptySpace(board, numbers, i - 1, j - 1);
            emptySpace(board, numbers, i - 1, j);
            emptySpace(board, numbers, i - 1, j + 1);
            emptySpace(board, numbers, i, j - 1);
            emptySpace(board, numbers, i, j + 1);
            emptySpace(board, numbers, i + 1, j - 1);
            emptySpace(board, numbers, i + 1, j);
            emptySpace(board, numbers, i + 1, j + 1);
        } else {
            board[i][j] = numbers[i][j];
        }
    }
}

function clearZeros(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] == 0) {
                board[i][j] = -3;
            }
        }
    }
}

function isBoardSolved(board, numbers) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (numbers[i][j] > 0) {
                if (board[i][j] != numbers[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function showBoard(board, showMines) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let number = board[i][j];
            const span = document.getElementById(`b-${i}-${j}`);
            span.replaceChildren();
            span.classList.remove("active");
            
            if (number > 0) {
                if (number == 1) span.classList.add("c1");
                if (number == 2) span.classList.add("c2");
                if (number == 3) span.classList.add("c3");
                if (number >= 4) span.classList.add("c4");

                const p = document.createElement("p");
                p.innerText = number;
                span.appendChild(p);
                span.classList.add("active");
            }

            if (number == -1 && showMines) {
                const img = document.createElement("img");
                img.src = "./images/mine.svg";
                img.alt = "mine";
                span.appendChild(img);
                span.classList.add("active");
            }

            if (number == -2) {
                const img = document.createElement("img");
                img.src = "./images/flag.svg";
                img.alt = "flag";
                span.appendChild(img);
                span.classList.add("active");
            }

            if (number == -3) {
                span.classList.add("active");
            }
        }
    }
}

function startGame() {
    let gameOver = false;

    let board = createBoard();
    generateMines(board, 10);
    let numbers = cloneBoard(board);
    generateNumbers(numbers);
    
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const span = document.getElementById(`b-${i}-${j}`);
            
            span.onclick = function(e) {
                e.preventDefault();
                if (gameOver) return;
    
                if (numbers[i][j] == -1) {
                    gameOver = true;
                    clearZeros(numbers);
                    showBoard(numbers, true);
                    setTimeout(function() {
                        alert("Game over!");
                    }, 200);
                } else if (numbers[i][j] == 0) {
                    emptySpace(board, numbers, i, j);
                    showBoard(board, false);
                } else {
                    board[i][j] = numbers[i][j];
                    showBoard(board, false);
                }
    
                if (isBoardSolved(board, numbers)) {
                    gameOver = true;
                    setTimeout(function() {
                        alert("You finished the game!");
                    }, 200);
                }
            }
    
            span.oncontextmenu = function(e) {
                e.preventDefault();
                if (gameOver) return;
    
                if (board[i][j] == -2) {
                    if (numbers[i][j] == -1) {
                        board[i][j] = -1;
                    } else {
                        board[i][j] = 0;
                    }
                } else if (board[i][j] == -1 || board[i][j] == 0) {
                    board[i][j] = -2;
                }
                showBoard(board, false);
            }
        }
    }
}

startGame();
