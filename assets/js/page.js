let winnerText = document.getElementById('winnerText');
let resetBtn = document.getElementById('resetBtn');
let boxes = Array.from(document.getElementsByClassName('boxes'));
let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_text = "O";
const X_text = "X";
let currentPlayer = X_text;
let gameOver = false;
let spaces = Array(9).fill(null);
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const startGame = () => {
    boxes.forEach(box => {
        box.addEventListener('click', boxClicked)
        box.classList.add('runningHover');
    })
    winnerText.innerText = `It is Player ${currentPlayer}'s turn..`;
}

function boxClicked(e) {
    if (gameOver) {
        return
    } else {
        const id = e.target.id;

        if (!spaces[id]) {
            spaces[id] = currentPlayer;
            e.target.innerText = currentPlayer;

            const winningBlocks = playerHasWon();

            if (winningBlocks !== false) {

                if (currentPlayer == O_text) {
                    winnerText.innerText = `Player O has won!`;
                }
                else {
                    winnerText.innerText = `Player X has won!`;
                }


                console.log(winningBlocks);

                winningBlocks.forEach(box => boxes[box].style.backgroundColor = winnerIndicator);
                gameOver = true;
                boxes.forEach(box => box.classList.remove('runningHover'));
                return
            }

            if (checkDraw()) {
                winnerText.innerText = "It's a draw!";
                endGame();
                return;
            }

            currentPlayer = currentPlayer == X_text ? O_text : X_text;
            winnerText.innerText = `It is Player ${currentPlayer}'s turn..`;
        }
    }
}



function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c];
        }
    }
    return false
}

function checkDraw() {
    if (spaces.some(space => space === null)) {
        return false;
    }

    // Check if no winning moves are left
    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i] === null) {
            // Simulate filling this space for both players and check if someone can win
            let tempSpaces = [...spaces];
            tempSpaces[i] = currentPlayer;
            let canWin = false;

            for (const condition of winningCombos) {
                let [a, b, c] = condition;

                if (tempSpaces[a] && (tempSpaces[a] == tempSpaces[b] && tempSpaces[a] == tempSpaces[c])) {
                    canWin = true;
                    break;
                }
            }

            if (!canWin) {
                return false; // At least one move found where someone can still win
            }
        }
    }

    return true; // No moves found where someone can win
}


function highlightWinningCombo(winningBlocks) {
    winningBlocks.forEach(box => boxes[box].style.backgroundColor = winnerIndicator);
}

function endGame() {
    gameOver = true;
    boxes.forEach(box => box.classList.remove('runningHover'));
}

resetBtn.addEventListener('click', reset);

function reset() {
    spaces.fill(null);
    gameOver = false;

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
        box.classList.add('runningHover');
    })

    currentPlayer = X_text;

    winnerText.innerText = `It is Player ${currentPlayer}'s turn..`;

}


startGame();
