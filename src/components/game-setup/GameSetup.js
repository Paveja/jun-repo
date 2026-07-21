import { useState } from 'react'

const BOARD_SIZES = [3, 4, 5]

const GameSetup = ({ config, onApply }) => {
  const [player1Name, setPlayer1Name] = useState(config.players[0].name)
  const [player1Symbol, setPlayer1Symbol] = useState(config.players[0].symbol)
  const [player2Name, setPlayer2Name] = useState(config.players[1].name)
  const [player2Symbol, setPlayer2Symbol] = useState(config.players[1].symbol)
  const [boardSize, setBoardSize] = useState(config.boardSize)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const name1 = player1Name.trim()
    const name2 = player2Name.trim()
    const symbol1 = player1Symbol.trim()
    const symbol2 = player2Symbol.trim()

    if (!name1 || !name2) {
      setError('Both players need a name.')
      return
    }

    if (symbol1.length !== 1 || symbol2.length !== 1) {
      setError('Each symbol must be exactly one character.')
      return
    }

    if (symbol1.toLowerCase() === symbol2.toLowerCase()) {
      setError('Player symbols must be different.')
      return
    }

    setError('')
    onApply({
      boardSize: Number(boardSize),
      players: [
        { name: name1, symbol: symbol1 },
        { name: name2, symbol: symbol2 },
      ],
    })
  }

  return (
    <section className="game-setup" aria-label="Game setup">
      <h2 className="game-setup-title">Game Setup</h2>
      <p className="game-setup-subtitle">Human vs Human — customize players and board</p>

      <form className="game-setup-form" onSubmit={handleSubmit}>
        <fieldset className="setup-fieldset">
          <legend>Player 1</legend>
          <label className="setup-field">
            <span>Name</span>
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              maxLength={20}
              autoComplete="off"
              aria-label="Player 1 name"
            />
          </label>
          <label className="setup-field setup-field--symbol">
            <span>Symbol</span>
            <input
              type="text"
              value={player1Symbol}
              onChange={(e) => setPlayer1Symbol(e.target.value.slice(0, 1))}
              maxLength={1}
              autoComplete="off"
              aria-label="Player 1 symbol"
            />
          </label>
        </fieldset>

        <fieldset className="setup-fieldset">
          <legend>Player 2</legend>
          <label className="setup-field">
            <span>Name</span>
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              maxLength={20}
              autoComplete="off"
              aria-label="Player 2 name"
            />
          </label>
          <label className="setup-field setup-field--symbol">
            <span>Symbol</span>
            <input
              type="text"
              value={player2Symbol}
              onChange={(e) => setPlayer2Symbol(e.target.value.slice(0, 1))}
              maxLength={1}
              autoComplete="off"
              aria-label="Player 2 symbol"
            />
          </label>
        </fieldset>

        <fieldset className="setup-fieldset setup-fieldset--board">
          <legend>Board size</legend>
          <div className="board-size-options" role="radiogroup" aria-label="Board size">
            {BOARD_SIZES.map((size) => (
              <label key={size} className={`board-size-option${boardSize === size ? ' is-selected' : ''}`}>
                <input
                  type="radio"
                  name="boardSize"
                  value={size}
                  checked={boardSize === size}
                  onChange={() => setBoardSize(size)}
                />
                <span>
                  {size}×{size}
                  <small>{size} in a row</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {error ? (
          <p className="setup-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="setup-apply">
          Apply &amp; Restart
        </button>
      </form>
    </section>
  )
}

export default GameSetup
