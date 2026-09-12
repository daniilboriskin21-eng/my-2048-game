/**
 * Утилиты для работы с плитками
 */

import { findEmptyCells } from "./boardUtils";

/**
 * Выбирает случайную пустую ячейку из переданного массива.
 * @param {Array<{row: number, col: number}>} empty - Массив пустых ячеек
 * @returns {{row: number, col: number}} Случайная пустая ячейка
 */
export function getRandomEmptyCell(empty) {
  const index = Math.floor(Math.random() * empty.length);
  return empty[index];
}

/**
 * Генерирует значение новой плитки.
 * В 90% случаев появляется 2, в 10% — 4.
 * @returns {number} Значение плитки (2 или 4)
 */
export function getRandomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

/**
 * Добавляет новую случайную плитку на игровое поле.
 * @param {Array<Array<number>>} board - Игровое поле
 * @returns {Array<Array<number>>} Новое поле с добавленной плиткой
 */
export function addRandomTile(board) {
  // Получаем список всех пустых ячеек
  const emptyCells = findEmptyCells(board);

  // Если свободных ячеек нет, возвращаем исходное поле
  if (emptyCells.length === 0) {
    return board;
  }

  // Создаём копию игрового поля
  const newBoard = board.map((row) => [...row]);

  // Выбираем случайную пустую ячейку и случайное значение плитки
  const randomCell = getRandomEmptyCell(emptyCells);
  const value = getRandomTileValue();

  // Добавляем плитку на выбранное место
  newBoard[randomCell.row][randomCell.col] = value;

  return newBoard;
}

/**
 * Добавляет новую случайную плитку и возвращает
 * игровое поле вместе с координатами новой плитки.
 * @param {Array<Array<number>>} board - Игровое поле
 * @returns {{board: Array<Array<number>>, newTile: ?{row: number, col: number, value: number}}}
 */
export function addRandomTileWithPosition(board) {
  const emptyCells = findEmptyCells(board);

  // Если свободных ячеек нет, возвращаем исходное поле без новой плитки
  if (emptyCells.length === 0) {
    return {
      board,
      newTile: null,
    };
  }

  // Создаём копию игрового поля
  const newBoard = board.map((row) => [...row]);

  // Выбираем случайную пустую ячейку
  const randomCell = getRandomEmptyCell(emptyCells);

  // Генерируем значение новой плитки
  const value = getRandomTileValue();

  // Добавляем плитку
  newBoard[randomCell.row][randomCell.col] = value;

  return {
    board: newBoard,
    // Запоминаем координаты и значение новой плитки
    newTile: {
      row: randomCell.row,
      col: randomCell.col,
      value,
    },
  };
}
