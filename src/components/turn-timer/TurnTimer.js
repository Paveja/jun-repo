const TurnTimer = ({ timeLeft, isActive }) => {
  if (!isActive) {
    return null
  }

  const isUrgent = timeLeft <= 3

  return (
    <section
      className={`turn-timer${isUrgent ? ' turn-timer--urgent' : ''}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="turn-timer-label">Time left</p>
      <p className="turn-timer-value">{timeLeft}s</p>
    </section>
  )
}

export default TurnTimer
