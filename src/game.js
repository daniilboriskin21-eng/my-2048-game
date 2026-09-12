/**
 * Основной файл для работы с игровой логикой 2048.
 * Переэкспортирует функции из модулей для удобства.
 */

// Переэкспортируем функции из утилит
export {
  boardsEqual,
  reverseRows,
  transpose,
  findEmptyCells,
} from "./utils/boardUtils";

export {
  getRandomEmptyCell,
  getRandomTileValue,
  addRandomTile,
  addRandomTileWithPosition,
} from "./utils/tileUtils";

export {
  slideRowLeft,
  getLeftMovements,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
} from "./utils/moveUtils";

export {
  isGameOver,
  isGameWon,
  createInitialBoard,
} from "./utils/gameStateUtils";
