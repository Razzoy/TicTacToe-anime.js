import anime from '../../animejs/lib/anime.es.js';

const tl = anime.timeline({
    duration: 800,
    easing: 'easeOutCubic',
});

let brickFall = anime.timeline({
    duration: 800,
    easing: 'easeOutBounce',
})

let crossDance;
let circleDance;
let headerJump;


// Variable imports
let winnerText = document.getElementById('winnerText');
let resetBtn = document.getElementById('resetBtn');
let boxes = Array.from(document.getElementsByClassName('boxes'));
let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');
let brickContainer = document.getElementById('bricks');

// Create bricks arrays
let X_bricks = [];
let O_bricks = [];

let gameOver = false;
let spaces = Array(9).fill(null);

function createBricks() {

    for (let i = 0; i < 5; i++) {
        let X_brick = document.createElement('div');
        let X_svg = document.createElement('img');
        X_svg.src = 'assets/img/svg/cross.svg';
        X_brick.classList.add('crossBrick');
        X_svg.classList.add('cross');
        X_brick.appendChild(X_svg);
        brickContainer.appendChild(X_brick);
        X_bricks.push(X_brick);
    }

    for (let i = 0; i < 4; i++) {
        let O_brick = document.createElement('div');
        let O_svg = document.createElement('img');
        O_svg.src = 'assets/img/svg/circle.svg';
        O_brick.classList.add('circleBrick');
        O_svg.classList.add('circle');
        O_brick.appendChild(O_svg);
        brickContainer.appendChild(O_brick);
        O_bricks.push(O_brick);
    }
}

createBricks();

let currentPlayer = 'X';

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
        box.addEventListener('click', boxClicked);
        box.classList.add('runningHover');
    });
    //anime.js add bricks falling When game starts
    brickFall.add({
        targets: '#bricks',
        translateY: 333,
        opacity: [0, 1]
    });

    function ticTacToeDelay(target, delay) {
        anime({
            targets: target,
            translateY: -10,
            duration: 1000,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            delay: delay,
            complete: function () {
                anime({
                    targets: target,
                    translateY: -10,
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    direction: 'alternate',
                    loop: true,
                });
            }
        });
    }
    ticTacToeDelay('#tic', 100);
    ticTacToeDelay('#tac', 400);
    ticTacToeDelay('#toe', 700);



    winnerText.innerText = `It is Player X 's turn..`;
};

function boxClicked(e) {
    if (gameOver) {
        return;
    } else {
        const id = e.target.id;

        if (!spaces[id]) {
            let brick;
            if (currentPlayer === 'X' && X_bricks.length > 0) {
                brick = X_bricks.shift();
            } else if (currentPlayer === 'O' && O_bricks.length > 0) {
                brick = O_bricks.shift();
            } else {
                return;
            }

            brickContainer.removeChild(brick);
            spaces[id] = currentPlayer;

            if (e.target.children.length === 0) {
                e.target.appendChild(brick);
                //added animation for changing parrent/moving brick to block
                anime({
                    targets: brick,
                    translateY: [brickContainer.getBoundingClientRect().top - e.target.getBoundingClientRect().top, 0],
                    translateX: [brickContainer.getBoundingClientRect().left - e.target.getBoundingClientRect().left, 0],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            }
            const winningBlocks = playerHasWon();

            if (winningBlocks !== false) {
                winnerText.innerText = `Player ${currentPlayer} has won !`;
                highlightWinningCombo(winningBlocks);
                gameOver = true;
                boxes.forEach(box => box.classList.remove('runningHover'));

                if (currentPlayer == 'X') {
                    function randomValues() {
                        crossDance = anime({
                            targets: '.crossBrick',
                            translateY: function () {
                                return anime.random(-8, 8);
                            },
                            translateX: function () {
                                return anime.random(-8, 8);
                            },
                            easing: 'easeInOutQuad',
                            duration: 400,
                            complete: randomValues
                        });
                    }
                    randomValues();
                } else if (currentPlayer == 'O') {
                    function randomValues() {
                        circleDance = anime({
                            targets: '.circleBrick',
                            translateY: function () {
                                return anime.random(-8, 8);
                            },
                            translateX: function () {
                                return anime.random(-8, 8);
                            },
                            easing: 'easeInOutQuad',
                            duration: 400,
                            complete: randomValues
                        });
                    }
                    randomValues();
                }
                return;
            }

            if (checkDraw()) {
                winnerText.innerText = "It's a draw!";
                endGame();
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            winnerText.innerText = `It is Player ${currentPlayer} 's turn..`;
        }
    }
}

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] === spaces[b] && spaces[a] === spaces[c])) {
            return [a, b, c];
        }
    }
    return false;
}

function checkDraw() {
    return spaces.every(space => space !== null);
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
    // Adds spin animation to gameboard
    tl.add({
        targets: '#gameboard',
        rotate: '1turn'
    });


    if (crossDance) {
        crossDance.pause();
    }
    if (circleDance) {
        circleDance.pause();
    }

    spaces.fill(null);
    gameOver = false;
    boxes.forEach(box => {
        //Restarts bricks falling animation
        if (!box.innerHTML == '') {
            brickFall.restart()
            box.innerHTML = '';
        } else{
            box.innerHTML = '';
        }
        box.style.backgroundColor = '';
        box.classList.add('runningHover');
    });

    brickContainer.innerHTML = '';
    X_bricks = [];
    O_bricks = [];
    createBricks();


    currentPlayer = 'X';
    winnerText.innerText = `It is Player X 's turn..`;
}

startGame();