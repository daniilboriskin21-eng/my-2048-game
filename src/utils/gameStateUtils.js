/**
 * Утилиты для управления состоянием игры
 */

import { findEmptyCells } from "./boardUtils";
import { addRandomTile } from "./tileUtils";

/**
 * Проверяет, закончилась ли игра.
 * Игра окончена, если:
 * 1. На поле нет пустых ячеек.
 * 2. Ни одна соседняя пара плиток не может быть объединена.
 * @returns {boolean}
 */
export function isGameOver(board) {
  // Если есть хотя бы одна пустая ячейка, игрок может продолжить игру
  if (findEmptyCells(board).length) {
    return false;
  }

  // Проверяем соседние ячейки по горизонтали и вертикали
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // Проверяем соседнюю ячейку справа
      if (col < board[row].length - 1) {
        if (board[row][col] === board[row][col + 1]) {
          return false;
        }
      }

      // Проверяем соседнюю ячейку снизу
      if (row < board.length - 1) {
        if (board[row][col] === board[row + 1][col]) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Проверяет, выиграл ли игрок.
 * Игра считается выигранной, если на поле есть плитка со значением 2048.
 * @returns {boolean}
 */
export function isGameWon(board) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 2048) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Создаёт начальное игровое поле.
 * В начале все ячейки пустые, после чего
 * в две случайные ячейки добавляются плитки.
 * @param {number} size - Размер доски (по умолчанию 4)
 * @returns {Array<Array<number>>}
 */
export function createInitialBoard(size = 4) {
  let board = Array.from({ length: size }, () => Array(size).fill(0));

  // Добавляем две стартовые плитки
  board = addRandomTile(board);
  board = addRandomTile(board);

  return board;
}
