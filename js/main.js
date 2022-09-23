'use strict'

//  cell: {
//  minesAroundCount: 4,
//  isShown: true,
//  isMine: false,
//  isMarked: true

// }

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gLevel = {
  SIZE: 4,
  MINES: 3,
}

var gGame

function initGame() {
  // This is called when page loads
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true,
    firstClickPos: null,
    poses: [],
    lifeCount: 0,
    level: 'Ez',
  }

  gBoard = buildBoard()
  renderBoard(gBoard)
  gGame.poses = getPosesForMines(gBoard)
}

function setMinesNegsCount(board) {
  // Count mines around each cell and set the cell's minesAroundCount.
}

function cellClicked(elCell, i, j) {
  // Called when a cell (td) is clicked
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
  // cell.isShown = true

  if (checkGameOver()) gameOver()
  console.log('borad with mines:', gBoard)
  expandShown(i, j)
  renderBoard(gBoard)
}

function startTimer() {
  gGame.isOn = true
  setInterval(renderTime, 1000)
}
function renderTime() {
  gGame.secsPassed++
  console.log('gGame.secsPassed:', gGame.secsPassed)
  var ElTimer = document.querySelector('.timer-container .timer')
  ElTimer.innerText = gGame.secsPassed
}

function _updateCell(type, i, j) {
  var cell = gBoard[i][j]
  switch (type) {
    case 'firstClick':
      gGame.isFirstClick = false
      gGame.firstClickPos = { i, j }
      gGame.poses = getAllPoses()
      placeMines(gGame.poses)
      countNegs()
      break
    case 'lives':
      gGame.lifeCount--
      cell.isShown = true
      break

    default:
      break
  }
}

function cellMarked(ev, elCell) {
  ev.preventDefault()
}

function checkGameOver() {
  console.log('is game over??')
  return false
  // Game ends when all mines are marked, and all the other cells are shown
}
function getAllPoses() {
  var poses = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
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

function setLevel(size, mines, level) {
  gLevel.SIZE = size
  gLevel.MINES = mines
  gGame.level = level
  initGame()
  // Change the level of the game by changing the global variables
}

function gameOver() {
  var ElDialog = document.querySelector('.dialog')
  gGame.isOn = false
  ElDialog.showModal()
}

function resetGame() {
  initGame()
  // checkScore()
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
