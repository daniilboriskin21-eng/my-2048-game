import "./App.css";
import GameBoard from "./components/GameBoard";
import Score from "./components/Score";
import GameMessage from "./components/GameMessage";
import StartScreen from "./components/StartScreen";
import { useGameState } from "./hooks/useGameState";

/**
 * Главный компонент приложения 2048.
 * Использует useGameState hook для управления состоянием игры.
 */
function App() {
  const {
    gameStarted,
    boardSize,
    board,
    newTile,
    mergedTiles,
    movements,
    score,
    bestScores,
    gameOver,
    gameWon,
    startGame,
    continueGame,
    restartGame,
    goToMenu,
  } = useGameState();

  if (!gameStarted) {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>2048</h1>

        <div className="header-right">
          <Score score={score} bestScore={bestScores[boardSize]} />

          <div className="header-buttons">
            <button onClick={goToMenu}>Menu</button>
            <button onClick={restartGame}>New Game</button>
          </div>
        </div>
      </div>

      <div className="game-container">
        {gameOver && <GameMessage type="over" onRestart={restartGame} />}
        {gameWon && (
          <GameMessage
            type="won"
            onRestart={restartGame}
            onContinue={continueGame}
          />
        )}

        <GameBoard
          board={board}
          newTile={newTile}
          mergedTiles={mergedTiles}
          movements={movements}
        />
      </div>
    </div>
  );
}

export default App;
