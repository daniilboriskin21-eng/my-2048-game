const GameMessage = ({ type, onRestart, onContinue }) => {
  const messages = {
    won: "You win!",
    over: "Game over!",
  };

  return (
    <div className={`game-message game-${type}`}>
      <h2>{messages[type]}</h2>

      <div className="message-buttons">
        {type === "won" && <button onClick={onContinue}>Continue</button>}

        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
};

export default GameMessage;
