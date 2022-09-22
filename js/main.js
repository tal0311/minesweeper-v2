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

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isFirstClick: true,
  firstClickPos: null,
  poses: [],
  lifeCount: 2,
}

function initGame() {
  // This is called when page loads
  gBoard = buildBoard()

  renderBoard(gBoard)
  gGame.poses = getPosesForMines(gBoard)

  gGame.isOn = true
}

function setMinesNegsCount(board) {
  // Count mines around each cell and set the cell's minesAroundCount.
}

function cellClicked(elCell, i, j) {
  // Called when a cell (td) is clicked

  if (!gGame.isOn) return

  var cell = gBoard[i][j]
  if (cell.isShown) return
  if (gGame.isFirstClick) {
    _updateCell('firstClick', i, j)
  }
  if (cell.isMine) {
    if (gGame.lifeCount) {
      gGame.lifeCount--
    }
    gameOver()
  }

  if (checkGameOver()) gameOver()
  expandShown(i, j)
  console.log(gBoard)
  renderBoard(gBoard)
}

function _updateCell(type, i, j) {
  switch (type) {
    case 'firstClick':
      gGame.isFirstClick = false
      gGame.firstClickPos = { i, j }
      gGame.poses = getAllPoses()
      placeMines(gGame.poses)
      countNegs()
      break

    default:
      break
  }
}

function cellMarked(ev, elCell) {
  ev.preventDefault()
}

function countNegs() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      gBoard[i][j].minesAroundCount = countMinesAround(i, j)
    }
  }
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
  var cell = gBoard[i][j]
  cell.isShown = true
  var negs = getAllNegs(i, j)
  for (var i = 0; i < negs.length; i++) {
    var neg = negs[i]

    if (!gBoard[neg.i][neg.j].isMine) {
      gBoard[neg.i][neg.j].isShown = true
      // gBoard[neg.i][neg.j]

      // return expandShown(neg.i, neg.j)
    }
  }
  // return cell
}

function setLevel(size, mines) {
  gLevel.SIZE = size
  gLevel.MINES = mines
  initGame()
  // Change the level of the game by changing the global variables
}

function gameOver() {
  console.log('Game Over')
}
