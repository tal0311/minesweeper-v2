'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gLevel = {
  SIZE: 4,
  MINES: 3,
}

var gGame

function initGame(lives = 2) {
  gGame = getInitialState(lives)
  document.querySelector('.timer').innerText = gGame.secsPassed
  document.querySelector('.lives-counter').innerText = gGame.lifeCount
  document.querySelector(
    '.safe-click'
  ).innerText = `Safe Click (${gGame.safeClick})`
  gBoard = buildBoard()
  renderBoard(gBoard)
  gGame.poses = getPosesForMines(gBoard)
}

function cellClicked(i, j) {
  if (!gGame.isOn) startTimer()
  if (!gGame.isOn) return
  var cell = gBoard[i][j]
  if (cell.isShown) return
  if (gGame.isFirstClick) {
    _updateCell('firstClick', i, j)
  }
  if (cell.isMine) {
    if (gGame.lifeCount) {
      _updateCell('lives', i, j)
      return
    }
    gameOver()
  }
  _updateCell('show-cell', i, j)
}

function cellMarked(ev, i, j) {
  ev.preventDefault()
  console.log(i, j)
  _updateCell('mark', i, j)
  renderBoard(gBoard)
}

function _updateCell(type, i, j) {
  // debugger
  var cell = gBoard[i][j]
  switch (type) {
    case 'firstClick':
      gGame.isFirstClick = false
      gGame.firstClickPos = { i, j }
      gGame.poses = getAllPoses()
      placeMines(gGame.poses)
      countNegs()
      return
    case 'lives':
      gGame.lifeCount--
      cell.isShown = true
      break
    case 'mark':
      gGame.markedCount++
      cell.isMarked = !cell.isMarked
      break

    default:
      expandShown(i, j)
      renderBoard(gBoard)
      break
  }
  checkGameOver()
  renderBoard(gBoard)
}

function checkGameOver() {
  if (!gGame.isOn) return
  var countMap = {
    markedMines: 0,
    shownMines: 0,
    unShownCells: 0,
  }

  var allCells = getAllPoses()

  for (var i = 0; i < allCells.length; i++) {
    const pos = allCells[i]
    // console.log(posI, posJ)
    var currCell = gBoard[pos.i][pos.j]
    if (currCell.isMarked && currCell.isMine) {
      console.log('updating count')
      countMap['markedMines']++
    }
    if (currCell.isMine && currCell.isShown) {
      countMap['shownMines']++
    }
    if (!currCell.isShown && !currCell.isMarked) {
      countMap['unShownCells']++
    }
  }

  const { markedMines, shownMines, unShownCells } = countMap
  console.log(countMap)
  if (
    (markedMines === gLevel.MINES && !unShownCells) ||
    (shownMines + markedMines === gLevel.MINES && !unShownCells)
  ) {
    gameOver('You have Found all mines.\n Play agin?')
  }

  // Game ends when all mines are marked, and all the other cells are shown
}

function getAllPoses() {
  var poses = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      // console.log(gBoard[i][j])
      poses.push({ i, j })
    }
  }
  return poses
}

function placeMines(poses) {
  var minesToPlace = []
  for (var k = 0; k < gLevel.MINES; k++) {
    var idx = getRandomInt(0, poses.length)
    var pos = poses.splice(idx, 1)[0]
    if (pos.i && pos.j === gGame.firstClickPos.i && gGame.firstClickPos.j) {
      placeMines(poses)
      return
    } else {
      minesToPlace.push(pos)
    }
  }
  for (var i = 0; i < minesToPlace.length; i++) {
    var mine = minesToPlace[i]
    gBoard[mine.i][mine.j].isMine = true
  }
}

function expandShown(i, j) {
  gBoard[i][j].isShown = true
  var negs = getAllNegs(i, j)
  if (negs.length === 0) return
  for (let i = 0; i < negs.length; i++) {
    var neg = negs[i]
    var currCell = gBoard[neg.i][neg.j]
    if (currCell.isMine) return
    expandShown(neg.i, neg.j)
  }
}

function setLevel(size, mines, level, lives) {
  gLevel.SIZE = size
  gLevel.MINES = mines
  initGame(lives, level)
  // Change the level of the game by changing the global variables
}

function showAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
      }
    }
  }
}

// BONUSES
// safe-click
function onSafeClick() {
  var loc = getESafeLoc()
  var elCell = document.querySelector(`.cell-${loc.i}-${loc.j}`)
  elCell.classList.toggle('safe-click')
  setTimeout(() => {
    elCell.classList.toggle('safe-click')
  }, 1000)

  gGame.safeClick--
  var elBtn = document.querySelector('button.safe-click')
  if (!gGame.safeClick) elBtn.disabled = true
  elBtn.innerText = `Safe Click (${gGame.safeClick})`
}
function checkScore() {
  const score = JSON.parse(localStorage.getItem('score'))
  if (!score || score[gGame.level].highScore > gGame.secsPassed) {
    const updatedScore = {
      highScore: gGame.secsPassed,
      level: gGame.level,
    }
  }
}

function startTimer() {
  gGame.isOn = true
  gGame.timeInterval = setInterval(renderTime, 1000)
}

function renderTime() {
  gGame.secsPassed++

  var ElTimer = document.querySelector('.timer-container .timer')
  ElTimer.innerText = gGame.secsPassed
}

function getESafeLoc() {
  var poses = getPosesForMines(gBoard)
  for (var i = 0; i < poses.length; i++) {
    var pos = poses[i]
    var cell = gBoard[pos.i][pos.j]
    if (!cell.isShown && !cell.isMine) {
      return pos
    }
  }
}
function gameOver(msg) {
  clearInterval(gGame.timeInterval)
  var ElDialog = document.querySelector('.dialog')
  ElDialog.querySelector('h1').innerText = msg || 'Not Good Enough, Try Again'
  gGame.isOn = false
  setTimeout(() => {
    ElDialog.showModal()
  }, 2000)
  showAllMines()
  renderBoard(gBoard)
}
function resetGame() {
  // checkScore()
  initGame()
}
function getInitialState(lifeCount, level = 'Ez') {
  return {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true,
    firstClickPos: null,
    poses: [],
    lifeCount,
    level,
    timeInterval: null,
    safeClick: 3,
  }
}
