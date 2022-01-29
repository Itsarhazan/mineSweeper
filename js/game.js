'use strict';

const MINE = '💣';
const FLAG = '🚩';
const START = '😀';


var gBoard = [];
var gIntervalTime;

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {}

function init() {
    gGame = {
        isOn: false,
        shownCount: 0,
        secsPassed: 0,
        markedCount: 0,
        life: 3
    };

    buildBoard(gLevel.size);
    renderBoard();
}

function buildBoard(size) {

    for (var i = 0; i < size; i++) {
        gBoard[i] = []
        for (var j = 0; j < size; j++) {

            gBoard[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMines: false,
                isMarked: false,
                ngs: 0
            };
        }
    }
    setMines()
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>';

        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].ngs = setMinesNegsCount(i, j)
            var currCell = '';
            var classGame = (gBoard[i][j].isShown) ? 'show' : 'hide';
            var className = `cell-${i}-${j}`;

            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isMines) {
                    currCell = MINE;
                } else {
                    currCell = gBoard[i][j].ngs;
                }
            }
            if (gBoard[i][j].isMarked && !gBoard[i][j].isShown) currCell = FLAG;

            strHTML += `<td class="cell ${className} ${classGame} " onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(${i}, ${j})">${currCell}</td>`;
        }
        strHTML += '</tr>';

        var elBoard = document.querySelector('.board');
        elBoard.innerHTML = strHTML;
    }
    checkGameOver()
}


function setMines() {
    for (var i = 0; i < gLevel.mines; i++) {

        var emptyCells = getEmptyCells();
        var randomCell = emptyCells[getRandomInt(0, emptyCells.length)]
        gBoard[randomCell.i][randomCell.j].isMines = true;

    }

}


function setMinesNegsCount(currI, currJ) {
    var minesAroundCount = 0;
    for (var i = currI - 1; i <= currI + 1; i++) {
        for (var j = currJ - 1; j <= currJ + 1; j++) {
            if (i === currI && j === currJ) continue;
            if (i < 0 || i > gLevel.size - 1) continue;
            if (j < 0 || j > gLevel.size - 1) continue;
            if (gBoard[i][j].isMines) minesAroundCount++
        }
        if (minesAroundCount === 0) minesAroundCount = '';
    }
    return minesAroundCount;
}


function cellClicked(cell, currI, currJ) {

    if (!gGame.isOn) {
        gIntervalTime = setInterval(setTime, 1000);
        gGame.isOn = true;
    }

    if (gBoard[currI][currJ].isMarked) return;
    if (!gGame.shownCount && gBoard[currI][currJ].isMines) restart();

    if (gBoard[currI][currJ].isMines) {
        var elCell = document.querySelector(`.cell-${currI}-${currJ}`)
        if (elCell.classList.contains('hide')) {
            elCell.classList.remove('hide');
            elCell.classList.add('show');
            gBoard[currI][currJ].isShown = true;
            gGame.shownCount++;
        }
        renderBoard();
        countLife();
        checkGameOver();

    } else if (gBoard[currI][currJ].ngs) {
        var elCell = document.querySelector(`.cell-${currI}-${currJ}`)
        if (elCell.classList.contains('hide')) {
            elCell.classList.remove('hide');
            elCell.classList.add('show');
            gBoard[currI][currJ].isShown = true;
            gGame.shownCount++;
            renderBoard();
        }
    } else if (!gBoard[currI][currJ].ngs) {
        for (var i = currI - 1; i <= currI + 1; i++) {
            for (var j = currJ - 1; j <= currJ + 1; j++) {
                if (i < 0 || i > gLevel.size - 1) continue;
                if (j < 0 || j > gLevel.size - 1) continue;

                var elCell = document.querySelector(`.cell-${i}-${j}`)
                if (gBoard[i][j].isMines) continue;
                if (gBoard[i][j].isMarked) continue;

                if (elCell.classList.contains('hide')) {
                    elCell.classList.remove('hide');
                    elCell.classList.add('show');
                    gBoard[i][j].isShown = true;
                    gGame.shownCount++;
                }
            }
        }
    }
    renderBoard();
    checkWin();
}


function checkGameOver() {

    if (gGame.life < 0) {
        gameover();
    }
}

function checkWin() {

    if ((gGame.shownCount === gLevel.size ** 2 - gGame.markedCount) && gGame.life >= 0) {
        var elStart = document.querySelector('.starter');
        elStart.innerText = '😍';
        clearInterval(gIntervalTime);
    }
}


function gameover() {
    clearInterval(gIntervalTime);
    var elStart = document.querySelector('.starter')
    elStart.innerText = '😢';

    alert('you lose 😢, choose a level to play again');

}





function countLife() {
    gGame.life--

        var elLife = document.querySelector('.lives');
    if (gGame.life === 2)
        elLife.innerText = '💓💓';
    else if (gGame.life === 1)
        elLife.innerText = '💓';
    else if (gGame.life === 0)
        elLife.innerText = '';

}

function restart() {
    clearInterval(gIntervalTime);

    minutes.innerText = '00';
    seconds.innerText = '00';
    var elStart = document.querySelector('.starter');
    elStart.innerText = '😀';
    var elLife = document.querySelector('.lives');
    elLife.innerText = '💖💖💖';

    init();
}