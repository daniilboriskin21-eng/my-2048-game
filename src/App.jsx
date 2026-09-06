import { useEffect, useRef, useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import Score from "./components/Score";

import {
  boardsEqual,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  addRandomTile,
  isGameOver,
  createInitialBoard,
  isGameWon,
} from "./game";

function App() {
  // Игровое поле.
  // При первом рендере создаём новое поле с двумя случайными плитками.
  const [board, setBoard] = useState(createInitialBoard);
  const boardRef = useRef(board);

  // Текущий счёт игрока.
  const [score, setScore] = useState(0);

  // Показывает, закончилась ли игра.
  const [gameOver, setGameOver] = useState(false);

  // Показывает, выиграл ли игрок.
  const [gameWon, setGameWon] = useState(false);

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
      const newBoard = addRandomTile(result.board);
      boardRef.current = newBoard;
      setBoard(newBoard);

      // Проверяем, остались ли возможные ходы.
      setGameOver(isGameOver(newBoard));

      // Проверяем, выиграл ли игрок.
      if (isGameWon(newBoard)) {
        setGameWon(true);
      }

      // Добавляем очки, полученные за объединение плиток.
      setScore((prev) => prev + result.score);
    }

    // Добавляем обработчик нажатия клавиш.
    window.addEventListener("keydown", handleKeyDown);

    // Удаляем обработчик при размонтировании компонента.
    // Это предотвращает накопление обработчиков.
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, gameWon]);

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
  }

  return (
    <div className="container">
      {/* Показываем сообщение только после окончания игры. */}
      {gameOver && <div className="game-message game-over">Game Over!</div>}

      {/* Показываем сообщение только после выигрыша. */}
      {gameWon && <div className="game-message game-won">You Win!</div>}

      <div className="controls">
        <Score score={score} />

        {/* Перезапускаем игру по нажатию кнопки. */}
        <button onClick={restartGame}>Restart</button>
      </div>

      <GameBoard board={board} />
    </div>
  );
}

export default App;