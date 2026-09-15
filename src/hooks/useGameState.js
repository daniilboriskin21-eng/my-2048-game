/**
 * Custom hook для управления состоянием игры 2048
 */

import { useEffect, useRef, useState } from "react";
import {
  boardsEqual,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  addRandomTileWithPosition,
  isGameOver,
  createInitialBoard,
  isGameWon,
} from "../game";
import { loadAllBestScores, saveBestScore } from "../utils/storageUtils";

const BOARD_SIZES = [4, 5, 6, 8];

export function useGameState() {
  const [gameStarted, setGameStarted] = useState(false);
  const [boardSize, setBoardSize] = useState(4);

  // Игровое поле
  const [board, setBoard] = useState(null);
  const boardRef = useRef(board);

  const touchStartRef = useRef(null);

  // Координаты и значение последней созданной плитки
  const [newTile, setNewTile] = useState(null);

  // Объединённые плитки
  const [mergedTiles, setMergedTiles] = useState([]);

  // Движения плиток
  const [movements, setMovements] = useState([]);

  // Фаза анимации
  const [animationPhase, setAnimationPhase] = useState("none");

  // Текущий счёт игрока
  const [score, setScore] = useState(0);

  // Лучшие результаты для каждого размера доски
  const [bestScores, setBestScores] = useState(() =>
    loadAllBestScores(BOARD_SIZES),
  );

  // Показывает, закончилась ли игра
  const [gameOver, setGameOver] = useState(false);

  // Показывает, выиграл ли игрок
  const [gameWon, setGameWon] = useState(false);

  // Запоминает, было ли уже показано сообщение о победе
  const winAcknowledged = useRef(false);

  const pendingMergedTiles = useRef([]);
  const pendingNewTile = useRef(null);
  const pendingBoard = useRef(null);

  /**
   * Начинает новую игру
   */
  function startGame(size) {
    const newBoard = createInitialBoard(size);

    setBoardSize(size);
    boardRef.current = newBoard;
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setAnimationPhase("none");
    setNewTile(null);
    setMergedTiles([]);
    setMovements([]);
    winAcknowledged.current = false;
    setGameStarted(true);
  }

  /**
   * Продолжает игру после достижения 2048
   */
  function continueGame() {
    setGameWon(false);
  }

  /**
   * Перезапускает текущую игру
   */
  function restartGame() {
    const newBoard = createInitialBoard(boardSize);
    boardRef.current = newBoard;
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setAnimationPhase("none");
    setNewTile(null);
    setMergedTiles([]);
    setMovements([]);
    winAcknowledged.current = false;
  }

  /**
   * Возвращает в меню
   */
  function goToMenu() {
    setGameStarted(false);
    setGameOver(false);
    setGameWon(false);
    setAnimationPhase("none");
    setNewTile(null);
    setMergedTiles([]);
    setMovements([]);
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const start = touchStartRef.current;

    if (!start) {
      return;
    }

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    // Не считать короткое касание свайпом
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) {
      return;
    }

    let key;

    if (Math.abs(dx) > Math.abs(dy)) {
      key = dx > 0 ? "ArrowRight" : "ArrowLeft";
    } else {
      key = dy > 0 ? "ArrowDown" : "ArrowUp";
    }

    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  }

  /**
   * Обработчик нажатий клавиш для движения плиток
   */
  useEffect(() => {
    function handleKeyDown(event) {
      // Если игра закончилась, игнорируем нажатия клавиш
      if (gameOver) {
        return;
      }

      const prevBoard = boardRef.current;
      let result;

      // Определяем направление движения по нажатой клавише
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
          return;
      }

      event.preventDefault();

      // Если после движения поле не изменилось, ход невозможен
      if (boardsEqual(prevBoard, result.board)) {
        return;
      }

      // Вычисляем новый результат вне setState
      const resultWithTile = addRandomTileWithPosition(result.board);

      const newBoard = resultWithTile.board;
      pendingBoard.current = newBoard;
      const movements = result.movements;

      // Логическое состояние игры уже содержит новую плитку.
      boardRef.current = newBoard;

      // Но визуально показываем поле до появления новой плитки.
      setBoard(result.board);

      pendingMergedTiles.current = result.mergedTiles;
      pendingNewTile.current = resultWithTile.newTile;

      setNewTile(null);
      setMergedTiles([]);

      setMovements(movements);
      setAnimationPhase("move");

      // Проверяем, остались ли возможные ходы
      setGameOver(isGameOver(newBoard));

      if (!winAcknowledged.current && isGameWon(newBoard)) {
        setGameWon(true);
        winAcknowledged.current = true;
      }

      // Добавляем очки, полученные за объединение плиток
      setScore((prevScore) => {
        const newScore = prevScore + result.score;

        setBestScores((prevBestScores) => {
          const currentBest = prevBestScores[boardSize] || 0;

          if (newScore <= currentBest) {
            return prevBestScores;
          }

          // Сохраняем новый лучший счет в localStorage
          saveBestScore(boardSize, newScore);

          return {
            ...prevBestScores,
            [boardSize]: newScore,
          };
        });

        return newScore;
      });
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, boardSize]);

  /**
   * Фаза анимации перемещения
   */
  useEffect(() => {
    if (animationPhase !== "move") {
      return;
    }

    const timer = setTimeout(() => {
      setMovements([]);
      setMergedTiles(pendingMergedTiles.current);
      setAnimationPhase("merge");
    }, 150);

    return () => clearTimeout(timer);
  }, [animationPhase]);

  /**
   * Фаза анимации объединения
   */
  useEffect(() => {
    if (animationPhase !== "merge") {
      return;
    }

    const timer = setTimeout(() => {
      setMergedTiles([]);
      setBoard(pendingBoard.current);
      setNewTile(pendingNewTile.current);
      setAnimationPhase("new");
    }, 150);

    return () => clearTimeout(timer);
  }, [animationPhase]);

  /**
   * Фаза анимации появления новой плитки
   */
  useEffect(() => {
    if (animationPhase !== "new") {
      return;
    }

    const timer = setTimeout(() => {
      setNewTile(null);
      setAnimationPhase("none");
    }, 150);

    return () => clearTimeout(timer);
  }, [animationPhase]);

  return {
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
    handleTouchStart,
    handleTouchEnd,
  };
}
