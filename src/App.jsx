import { useEffect, useState } from "react";
import "./App.css";

import {
  boardsEqual,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  addRandomTile,
  isGameOver,
  createInitialBoard,
} from "./game";

function App() {
  const [board, setBoard] = useState(createInitialBoard);

  const [score, setScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      setBoard((prevBoard) => {
        let result;

        switch (event.key) {
          case "ArrowLeft":
            result = moveLeft(prevBoard);
            break;
          case "ArrowRight":
            result = moveRight(prevBoard);
            break;
          case "ArrowUp":
            result = moveUp(prevBoard);
            break;
          case "ArrowDown":
            result = moveDown(prevBoard);
            break;
          default:
            return prevBoard;
        }

        if (boardsEqual(prevBoard, result.board)) {
          return prevBoard;
        }

        const newBoard = addRandomTile(result.board);

        if (isGameOver(newBoard)) {
          setGameOver(true);
        }

        setScore((prev) => prev + result.score);

        return newBoard;
      });
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function restartGame() {
    setBoard(createInitialBoard());

    setScore(0);

    setGameOver(false);
  }

  return (
    <div className="container">
      {gameOver && <h2>Game Over!</h2>}
      <div className="controls">
        <h2>Score: {score}</h2>

        <button onClick={restartGame}>Restart</button>
      </div>
      <div className="game">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="cell">
              {cell !== 0 ? cell : ""}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

export default App;
