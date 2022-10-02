
# Minesweeper V2

A project within a programming school
Coding Academy

A game inspired by the classic game Minesweeper.

The project was built using vanilla JS.
and CSS.

#  code snippet
The code snippet before you shows the recursive opening of cells when clicking on a cell that has no neighbors.
```
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
```




## Authors

Tal Amit - Fullstack developer, Coding Academy Teaching assistant
