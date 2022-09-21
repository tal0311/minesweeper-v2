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
  MINES: 2,
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isFirstClick: true,
}

function initGame() {
  // This is called when page loads
  gBoard = buildBoard()
  console.log(gBoard)
  renderBoard(gBoard)
  var poses = getPosesForMines(gBoard)
  console.log('poses:', poses)
}

function setMinesNegsCount(board) {
  // Count mines around each cell and set the cell's minesAroundCount.
}

function cellClicked(elCell, i, j) {
  // Called when a cell (td) is clicked

  var cell = gBoard[i][j]
  if (cell.isShown) return
  cell.isShown = true
  console.log('elCell:', elCell)
  console.log('i:', i)
  console.log('j:', j)

  renderBoard(gBoard)
}

function cellMarked(ev, elCell) {
  ev.preventDefault()
  console.log('right elCell:', elCell)
}

function checkGameOver() {
  // Game ends when all mines are marked, and all the other cells are shown
}

function expandShown(board, elCell, i, j) {
  // When user clicks a cell with no
  // mines around, we need to open
  // not only that cell, but also its
  // neighbors.
}

function setLevel(size) {
  gLevel.SIZE = size
  initGame()
  // Change the level of the game by changing the global variables
}
