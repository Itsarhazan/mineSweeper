'use strict';

function cellMarked(i, j) {
    window.event.preventDefault()
    if (!gGame.isOn) {
        intervalTime = setInterval(setTime, 1000);
        gGame.isOn = true
    }

    gBoard[i][j].isMarked = (gBoard[i][j].isMarked) ? false : true;
    gGame.markedCount++
        renderBoard()
    checkWin()
}

var minutes = document.getElementById("minutes");
var seconds = document.getElementById("seconds");

function setTime() {

    ++gGame.secsPassed;
    seconds.innerHTML = minute(gGame.secsPassed % 60);
    minutes.innerHTML = minute(parseInt(gGame.secsPassed / 60));
}

function minute(val) {
    var valStr = val + "";
    if (valStr.length < 2) {
        return "0" + valStr;
    } else {
        return valStr;
    }
}


function levels(size, mines) {

    gLevel.size = size;
    gLevel.mines = mines;

    restart()
}

function getEmptyCells() {
    var emptyCells = [];
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {

            if (!gBoard[i][j].isMines) {
                emptyCells.push({ i: i, j: j })
            }
        }
    }
    return emptyCells;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}