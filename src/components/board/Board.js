import Square from '../square/Square'

const Board = ({ squares, boardSize, onClick, jumpTo, winningIndices }) => {
  const renderSquare = (i) => {
    const isWinning = winningIndices.includes(i)
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinning={isWinning}
      />
    )
  }

  const rows = []
  for (let row = 0; row < boardSize; row++) {
    const cells = []
    for (let col = 0; col < boardSize; col++) {
      cells.push(renderSquare(row * boardSize + col))
    }
    rows.push(
      <section className="board-row" key={row}>
        {cells}
      </section>
    )
  }

  return (
    <section className="game-section">
      <section className={`game-board board-size-${boardSize}`}>
        {rows}
      </section>
      <button className="restart" onClick={() => jumpTo(0)}>
        Restart the game
      </button>
    </section>
  )
}

export default Board
