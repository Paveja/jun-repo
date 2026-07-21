import Friends from '../../assets/images/friends.webp'

const GameInfo = ({ winner, isDraw, xIsNext, players }) => {
  const currentPlayer = xIsNext ? players[0] : players[1]
  const winnerPlayer = winner
    ? players.find((player) => player.symbol === winner)
    : null

  let message
  let messageClass = xIsNext ? 'player-x' : 'player-o'

  if (winnerPlayer) {
    message = `${winnerPlayer.name} (${winnerPlayer.symbol}) wins!`
    messageClass = winnerPlayer === players[0] ? 'player-x' : 'player-o'
  } else if (isDraw) {
    message = "It's a draw!"
    messageClass = 'player-x'
  } else {
    message = `Your turn, ${currentPlayer.name} (${currentPlayer.symbol})`
  }

  return (
    <section className="game-information">
      <h3 className={messageClass}>{message}</h3>
      <img
        src={Friends}
        alt={`${players[0].name} vs ${players[1].name}`}
      />
    </section>
  )
}

export default GameInfo
