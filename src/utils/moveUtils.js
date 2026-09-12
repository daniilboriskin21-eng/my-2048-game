/**
 * Утилиты для движения плиток на доске
 */

import { reverseRows, transpose } from "./boardUtils";

/**
 * Выполняет движение одной строки влево.
 * Убирает нули, объединяет одинаковые соседние плитки
 * и добавляет нули в конец строки.
 * @returns {{row: Array<number>, score: number, mergedPositions: Array<number>}}
 */
export function slideRowLeft(row) {
  const mergedPositions = [];

  // Убираем все пустые ячейки
  const compactRow = row.filter((cell) => cell !== 0);

  const mergedRow = [];
  let score = 0;

  // Проходим по непустым плиткам строки
  for (let i = 0; i < compactRow.length; i++) {
    // Если текущая и следующая плитки одинаковые, объединяем их в одну
    if (compactRow[i] === compactRow[i + 1]) {
      const mergedValue = compactRow[i] * 2;

      mergedPositions.push(mergedRow.length);
      mergedRow.push(mergedValue);
      score += mergedValue;

      // Пропускаем следующую плитку, так как она уже участвовала в объединении
      i++;
    } else {
      // Если объединение невозможно, просто добавляем текущую плитку
      mergedRow.push(compactRow[i]);
    }
  }

  // Заполняем оставшиеся позиции нулями
  while (mergedRow.length < row.length) {
    mergedRow.push(0);
  }

  return {
    row: mergedRow,
    score,
    mergedPositions,
  };
}

/**
 * Получает информацию о движениях плиток при движении влево
 */
export function getLeftMovements(board) {
  const movements = [];

  for (let row = 0; row < board.length; row++) {
    const currentRow = board[row];

    // Получаем только непустые плитки, сохраняя их исходные позиции
    const tiles = currentRow
      .map((value, col) => ({
        value,
        col,
      }))
      .filter((tile) => tile.value !== 0);

    let targetCol = 0;

    for (let i = 0; i < tiles.length; i++) {
      const currentTile = tiles[i];
      const nextTile = tiles[i + 1];

      // Если две соседние плитки одинаковые, обе перемещаются в одну позицию и объединяются
      if (nextTile && currentTile.value === nextTile.value) {
        if (currentTile.col !== targetCol) {
          movements.push({
            from: {
              row,
              col: currentTile.col,
            },
            to: {
              row,
              col: targetCol,
            },
          });
        }

        if (nextTile.col !== targetCol) {
          movements.push({
            from: {
              row,
              col: nextTile.col,
            },
            to: {
              row,
              col: targetCol,
            },
          });
        }

        targetCol++;
        i++;
      } else {
        // Обычное перемещение без объединения
        if (currentTile.col !== targetCol) {
          movements.push({
            from: {
              row,
              col: currentTile.col,
            },
            to: {
              row,
              col: targetCol,
            },
          });
        }

        targetCol++;
      }
    }
  }

  return movements;
}

/**
 * Выполняет движение всего игрового поля влево.
 * @returns {{board: Array<Array<number>>, score: number, mergedTiles: Array, movements: Array}}
 */
export function moveLeft(board) {
  let score = 0;
  const mergedTiles = [];

  const movements = getLeftMovements(board);

  const newBoard = board.map((row, rowIndex) => {
    const result = slideRowLeft(row);

    score += result.score;

    result.mergedPositions.forEach((colIndex) => {
      mergedTiles.push({
        row: rowIndex,
        col: colIndex,
      });
    });

    return result.row;
  });

  return {
    board: newBoard,
    score,
    mergedTiles,
    movements,
  };
}

/**
 * Выполняет движение вправо.
 * Используем разворот строк и уже готовый алгоритм движения влево.
 */
export function moveRight(board) {
  const reversedBoard = reverseRows(board);
  const result = moveLeft(reversedBoard);

  const mergedTiles = result.mergedTiles.map((tile) => ({
    row: tile.row,
    col: board[tile.row].length - 1 - tile.col,
  }));

  const movements = result.movements.map((movement) => ({
    from: {
      row: movement.from.row,
      col: board[movement.from.row].length - 1 - movement.from.col,
    },
    to: {
      row: movement.to.row,
      col: board[movement.to.row].length - 1 - movement.to.col,
    },
  }));

  return {
    board: reverseRows(result.board),
    score: result.score,
    mergedTiles,
    movements,
  };
}

/**
 * Выполняет движение вверх.
 * Транспонируем поле, чтобы столбцы стали строками,
 * после чего применяем движение влево.
 */
export function moveUp(board) {
  const transposedBoard = transpose(board);
  const result = moveLeft(transposedBoard);

  const mergedTiles = result.mergedTiles.map((tile) => ({
    row: tile.col,
    col: tile.row,
  }));

  const movements = result.movements.map((movement) => ({
    from: {
      row: movement.from.col,
      col: movement.from.row,
    },
    to: {
      row: movement.to.col,
      col: movement.to.row,
    },
  }));

  return {
    board: transpose(result.board),
    score: result.score,
    mergedTiles,
    movements,
  };
}

/**
 * Выполняет движение вниз.
 * Транспонируем поле, после чего применяем движение вправо.
 */
export function moveDown(board) {
  const transposedBoard = transpose(board);
  const result = moveRight(transposedBoard);

  const mergedTiles = result.mergedTiles.map((tile) => ({
    row: tile.col,
    col: tile.row,
  }));

  const movements = result.movements.map((movement) => ({
    from: {
      row: movement.from.col,
      col: movement.from.row,
    },
    to: {
      row: movement.to.col,
      col: movement.to.row,
    },
  }));

  return {
    board: transpose(result.board),
    score: result.score,
    mergedTiles,
    movements,
  };
}
