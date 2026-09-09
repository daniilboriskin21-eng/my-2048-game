import { useEffect, useRef, useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import Score from "./components/Score";
import GameMessage from "./components/GameMessage";

import {
  boardsEqual,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  addRandomTile,
  addRandomTileWithPosition,
  isGameOver,
  createInitialBoard,
  isGameWon,
} from "./game";

function App() {
  // Игровое поле.
  // При первом рендере создаём новое поле с двумя случайными плитками.
  const [board, setBoard] = useState(createInitialBoard());
  const boardRef = useRef(board);

  // Координаты и значение последней созданной плитки.
  const [newTile, setNewTile] = useState(null);

  const [mergedTiles, setMergedTiles] = useState([]);

  // Текущий счёт игрока.
  const [score, setScore] = useState(0);

  // Лучший счет игрока
  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem("bestScore")) || 0;
  });

  // Показывает, закончилась ли игра.
  const [gameOver, setGameOver] = useState(false);

  // Показывает, выиграл ли игрок.
  const [gameWon, setGameWon] = useState(false);

  // Запоминает, было ли уже показано сообщение о победе, чтобы не показывать его повторно.
  const winAcknowledged = useRef(false);

  // Следим за обновлением лучшего счёта
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("bestScore", score);
    }
  }, [score, bestScore]);

  // Подписываемся на нажатия клавиш.
  useEffect(() => {
    function handleKeyDown(event) {
      // Если игра закончилась, игнорируем нажатия клавиш.
      if (gameOver) {
        return;
      }

      const prevBoard = boardRef.current;
      let result;

      // Определяем направление движения по нажатой клавише.
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

        // Если нажата любая другая клавиша, ничего не меняем.
        default:
          return;
      }

      // Если после движения поле не изменилось, ход невозможен.
      if (boardsEqual(prevBoard, result.board)) {
        return;
      }

      // Вычисляем новый результат вне setState, чтобы StrictMode
      // не повторил случайный ход и побочные обновления состояния.
      const resultWithTile = addRandomTileWithPosition(result.board);

      const newBoard = resultWithTile.board;
      const newTile = resultWithTile.newTile;
      const mergedTiles = result.mergedTiles;

      boardRef.current = newBoard;
      setBoard(newBoard);

      setNewTile(newTile);
      setMergedTiles(mergedTiles);

      // Проверяем, остались ли возможные ходы.
      setGameOver(isGameOver(newBoard));

      if (!winAcknowledged.current && isGameWon(newBoard)) {
        setGameWon(true);
        winAcknowledged.current = true;
      }

      // Добавляем очки, полученные за объединение плиток.
      setScore((prev) => {
        const newScore = prev + result.score;

        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem("bestScore", newScore);
        }

        return newScore;
      });
    }

    // Добавляем обработчик нажатия клавиш.
    window.addEventListener("keydown", handleKeyDown);

    // Удаляем обработчик при размонтировании компонента.
    // Это предотвращает накопление обработчиков.
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver]);

  // Продолжаем игру после 2048
  function continueGame() {
    setGameWon(false);
  }

  // Начинает новую игру.
  function restartGame() {
    // Создаём новое поле с двумя стартовыми плитками.
    const newBoard = createInitialBoard();
    boardRef.current = newBoard;
    setBoard(newBoard);

    // Сбрасываем счёт.
    setScore(0);

    // Сбрасываем состояние Game Over.
    setGameOver(false);

    // Сбрасываем состояние You Win.
    setGameWon(false);

    // Сбрасываем флаг, показывающий, что сообщение о победе уже было показано.
    winAcknowledged.current = false;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>2048</h1>

        <div className="header-right">
          <Score score={score} bestScore={bestScore} />

          <button onClick={restartGame}>New Game</button>
        </div>
      </div>

      <div className="game-container">
        {/* Показываем сообщение только после окончания игры или выигрыша. */}
        {gameOver && <GameMessage type="over" onRestart={restartGame} />}
        {gameWon && (
          <GameMessage
            type="won"
            onRestart={restartGame}
            onContinue={continueGame}
          />
        )}

        <GameBoard board={board} newTile={newTile} mergedTiles={mergedTiles} />
      </div>
    </div>
  );
}

export default App;
