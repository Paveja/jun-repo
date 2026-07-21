import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import calculateWinner from './helpers/calculateWinner'
import Board from './components/board/Board'
import GameInfo from './components/game-info/GameInfo'
import GameCounter from './components/game-counter/GameCounter'
import TurnTimer from './components/turn-timer/TurnTimer'
import GameSetup from './components/game-setup/GameSetup'

const TURN_DURATION = 10

const DEFAULT_PLAYERS = [
  { name: 'Player 1', symbol: 'X' },
  { name: 'Player 2', symbol: 'O' },
]

const createEmptyBoard = (boardSize) => Array(boardSize * boardSize).fill(null)

class Game extends React.Component {
  constructor(props) {
    super(props)
    const savedGamesPlayed = localStorage.getItem('totalGamesPlayed')
    const boardSize = 3
    this.state = {
      boardSize,
      players: DEFAULT_PLAYERS.map((player) => ({ ...player })),
      history: [
        {
          squares: createEmptyBoard(boardSize),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      darkMode: false,
      totalGamesPlayed: savedGamesPlayed ? parseInt(savedGamesPlayed, 10) : 0,
      lastGameWinner: null,
      timeLeft: TURN_DURATION,
    }
    this.timerId = null
  }

  componentDidMount() {
    this.startTurnTimer()
  }

  componentWillUnmount() {
    this.clearTurnTimer()
  }

  startTurnTimer() {
    this.clearTurnTimer()
    this.timerId = setInterval(() => {
      this.tickTurnTimer()
    }, 1000)
  }

  clearTurnTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  isGameOver(squares, boardSize) {
    const result = calculateWinner(squares, boardSize)
    const isBoardFull = squares.every((square) => square !== null)
    return Boolean(result) || isBoardFull
  }

  tickTurnTimer() {
    const { history, stepNumber, boardSize } = this.state
    const current = history[stepNumber]
    if (this.isGameOver(current.squares, boardSize)) {
      return
    }

    this.setState((prevState) => {
      if (prevState.timeLeft <= 1) {
        // Time expired: skip the current player's turn without placing a mark
        return {
          xIsNext: !prevState.xIsNext,
          timeLeft: TURN_DURATION,
        }
      }
      return { timeLeft: prevState.timeLeft - 1 }
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const { boardSize, players, xIsNext } = this.state

    if (calculateWinner(squares, boardSize) || squares[i]) {
      return
    }

    squares[i] = xIsNext ? players[0].symbol : players[1].symbol
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !xIsNext,
      timeLeft: TURN_DURATION,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      lastGameWinner: null,
      timeLeft: TURN_DURATION,
    })
  }

  applySetup(config) {
    const boardSize = config.boardSize
    this.setState({
      boardSize,
      players: config.players.map((player) => ({ ...player })),
      history: [
        {
          squares: createEmptyBoard(boardSize),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      lastGameWinner: null,
      timeLeft: TURN_DURATION,
    })
  }

  incrementGamesPlayed() {
    const newTotal = this.state.totalGamesPlayed + 1
    this.setState({
      totalGamesPlayed: newTotal,
    })
    localStorage.setItem('totalGamesPlayed', newTotal.toString())
  }

  toggleDarkMode() {
    this.setState({
      darkMode: !this.state.darkMode,
    })
  }

  render() {
    const { boardSize, players, history, stepNumber, xIsNext, darkMode, totalGamesPlayed, timeLeft } = this.state
    const current = history[stepNumber]
    const result = calculateWinner(current.squares, boardSize)
    const winner = result ? result.winner : null
    const winningIndices = result ? result.indices : []

    // Check if game is completed (winner or draw)
    const isBoardFull = current.squares.every(square => square !== null)
    const isGameCompleted = Boolean(winner) || isBoardFull
    const isDraw = !winner && isBoardFull

    // Increment counter only when game transitions from incomplete to complete
    if (isGameCompleted && this.state.lastGameWinner !== winner && !this.state.lastGameWinner) {
      this.incrementGamesPlayed()
      this.setState({ lastGameWinner: winner || 'draw' })
    }

    return (
      <React.Fragment>
        <button
          className="theme-toggle"
          onClick={() => this.toggleDarkMode()}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <main className={darkMode ? 'dark-mode' : ''}>
          <h1>Tic Tac Toe</h1>
          <GameCounter totalGamesPlayed={totalGamesPlayed} />
          <TurnTimer timeLeft={timeLeft} isActive={!isGameCompleted} />
          <GameSetup
            key={`${boardSize}-${players[0].name}-${players[0].symbol}-${players[1].name}-${players[1].symbol}`}
            config={{ boardSize, players }}
            onApply={(config) => this.applySetup(config)}
          />
          <section className="game">
            <GameInfo
              winner={winner}
              isDraw={isDraw}
              xIsNext={xIsNext}
              players={players}
            />
            <Board
              squares={current.squares}
              boardSize={boardSize}
              onClick={(i) => this.handleClick(i)}
              jumpTo={(i) => this.jumpTo(i)}
              winningIndices={winningIndices}
            />
          </section>
        </main>
      </React.Fragment>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Router basename={process.env.REACT_APP_URI}>
  <Routes>
    <Route path="/" element={<Game />} />
  </Routes>
</Router>)
