/**
 * Detect an N-in-a-row winner on an N×N board (win length === boardSize).
 * @param {(string|null)[]} squares - Flat board of length boardSize^2
 * @param {number} boardSize - Board dimension (3, 4, or 5)
 * @returns {{ winner: string, indices: number[] } | null}
 */
function calculateWinner(squares, boardSize = 3) {
  if (!squares || squares.length !== boardSize * boardSize) {
    return null
  }

  const winLength = boardSize
  const indexAt = (row, col) => row * boardSize + col

  const lineWins = (indices) => {
    const first = squares[indices[0]]
    if (!first) {
      return null
    }
    for (let i = 1; i < indices.length; i++) {
      if (squares[indices[i]] !== first) {
        return null
      }
    }
    return { winner: first, indices }
  }

  // Rows
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col <= boardSize - winLength; col++) {
      const indices = []
      for (let k = 0; k < winLength; k++) {
        indices.push(indexAt(row, col + k))
      }
      const result = lineWins(indices)
      if (result) {
        return result
      }
    }
  }

  // Columns
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row <= boardSize - winLength; row++) {
      const indices = []
      for (let k = 0; k < winLength; k++) {
        indices.push(indexAt(row + k, col))
      }
      const result = lineWins(indices)
      if (result) {
        return result
      }
    }
  }

  // Diagonals (top-left → bottom-right)
  for (let row = 0; row <= boardSize - winLength; row++) {
    for (let col = 0; col <= boardSize - winLength; col++) {
      const indices = []
      for (let k = 0; k < winLength; k++) {
        indices.push(indexAt(row + k, col + k))
      }
      const result = lineWins(indices)
      if (result) {
        return result
      }
    }
  }

  // Diagonals (top-right → bottom-left)
  for (let row = 0; row <= boardSize - winLength; row++) {
    for (let col = winLength - 1; col < boardSize; col++) {
      const indices = []
      for (let k = 0; k < winLength; k++) {
        indices.push(indexAt(row + k, col - k))
      }
      const result = lineWins(indices)
      if (result) {
        return result
      }
    }
  }

  return null
}

export default calculateWinner
