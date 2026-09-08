function Score({ score, bestScore }) {
  return (
    <div className="score">
      <div className="score-item">
        <span>Score</span>
        <strong>{score}</strong>
      </div>

      <div className="score-item">
        <span>Best</span>
        <strong>{bestScore}</strong>
      </div>
    </div>
  );
}

export default Score;
