/**
 * Утилиты для работы с игровой доской
 */

/**
 * Сравнивает два игровых поля.
 * @returns {boolean} true, если все ячейки обоих полей имеют одинаковые значения
 */
export function boardsEqual(board1, board2) {
  for (let row = 0; row < board1.length; row++) {
    for (let col = 0; col < board1[row].length; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Разворачивает каждую строку игрового поля.
 * Используется для реализации движения вправо через алгоритм движения влево.
 */
export function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

/**
 * Транспонирует игровое поле: строки становятся столбцами, столбцы — строками.
 * Используется для реализации движения вверх и вниз
 * через алгоритм движения влево и вправо.
 */
export function transpose(board) {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
}

/**
 * Находит все пустые ячейки игрового поля.
 * @returns {Array<{row: number, col: number}>} Массив объектов с координатами
 */
export function findEmptyCells(board) {
  const empty = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        empty.push({ row, col });
      }
    }
  }

  return empty;
}
