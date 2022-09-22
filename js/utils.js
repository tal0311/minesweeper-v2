function renderBoard(board) {
  console.log(board)
  var strHTML = '<table border="1"><tbody>'
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`
    for (var j = 0; j < board[0].length; j++) {
      const className = getCellClass(board[i][j], i, j)
      console.log(className)
      getCellContent(i, j)
      strHTML += `<td  onclick= "cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(event, ${i}, ${j})"
       class="${className}">${getCellContent(i, j)}</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  var container = document.querySelector('.board-container')
  container.innerHTML = strHTML
}

function getCellContent(i, j) {
  var cell = gBoard[i][j]
  if (cell.isShown) {
    if (cell.isMine) return MINE
    if (cell.minesAroundCount) return cell.minesAroundCount
  }
  if (cell.isMarked) {
    return FLAG
  }
  return ''
}
function getCellClass(cell, i, j) {
  const { isMarked, isMine, isShown } = cell
  classStr = `cell cell-${i}-${j} ${isMarked ? 'marked' : ''} ${
    isMine ? 'mine' : ''
  } ${isShown ? 'isShown' : ''}`
  return classStr
}

function buildBoard() {
  //  Builds the board
  // Set mines at random locations
  // Call setMinesNegsCount()
  // Return the created board
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  return board
}

function getPosesForMines(board) {
  var poses = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      poses.push({ i, j })
    }
  }
  return poses
}

function countMinesAround(posI, posJ) {
  var count = 0
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue
      if (i === posI && j === posJ) continue
      var isMine = gBoard[i][j].isMine
      if (isMine) count++
    }
  }

  return count
}

function getAllNegs(posI, posJ) {
  var negsPoses = []
  for (var i = posI - 1; i <= posI + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = posJ - 1; j <= posJ + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue
      if (i === posI && j === posJ) continue

      negsPoses.push({ i, j })
    }
  }
  return negsPoses
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
