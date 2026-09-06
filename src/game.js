// Сравнивает два игровых поля.
// Возвращает true, если все ячейки обоих полей имеют одинаковые значения.
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

// Разворачивает каждую строку игрового поля.
// Используется для реализации движения вправо через алгоритм движения влево.
export function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

// Транспонирует игровое поле:
// строки становятся столбцами, а столбцы — строками.
// Используется для реализации движения вверх и вниз
// через алгоритм движения влево и вправо.
export function transpose(board) {
  return board[0].map((_, colIndex) =>
    board.map((row) => row[colIndex]),
  );
}

// Находит все пустые ячейки игрового поля.
// Возвращает массив объектов с координатами { row, col }.
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

// Проверяет, закончилась ли игра.
// Игра окончена, если:
// 1. На поле нет пустых ячеек.
// 2. Ни одна соседняя пара плиток не может быть объединена.
export function isGameOver(board) {
  // Если есть хотя бы одна пустая ячейка,
  // игрок может продолжить игру.
  if (findEmptyCells(board).length) {
    return false;
  }

  // Проверяем соседние ячейки по горизонтали и вертикали.
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // Проверяем соседнюю ячейку справа.
      if (col < board[row].length - 1) {
        if (board[row][col] === board[row][col + 1]) {
          return false;
        }
      }

      // Проверяем соседнюю ячейку снизу.
      if (row < board.length - 1) {
        if (board[row][col] === board[row + 1][col]) {
          return false;
        }
      }
    }
  }

  return true;
}

// Выбирает случайную пустую ячейку из переданного массива.
export function getRandomEmptyCell(empty) {
  const index = Math.floor(Math.random() * empty.length);

  return empty[index];
}

// Генерирует значение новой плитки.
// В 90% случаев появляется 2, в 10% — 4.
export function getRandomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

// Добавляет новую случайную плитку на игровое поле.
export function addRandomTile(board) {
  // Получаем список всех пустых ячеек.
  const emptyCells = findEmptyCells(board);

  // Если свободных ячеек нет, возвращаем исходное поле.
  if (emptyCells.length === 0) {
    return board;
  }

  // Создаём копию игрового поля,
  // чтобы не изменять исходный массив напрямую.
  const newBoard = board.map((row) => [...row]);

  // Выбираем случайную пустую ячейку
  // и случайное значение плитки.
  const randomCell = getRandomEmptyCell(emptyCells);
  const value = getRandomTileValue();

  // Добавляем плитку на выбранное место.
  newBoard[randomCell.row][randomCell.col] = value;

  return newBoard;
}

// Выполняет движение одной строки влево.
// Убирает нули, объединяет одинаковые соседние плитки
// и добавляет нули в конец строки.
// Также возвращает количество набранных очков.
export function slideRowLeft(row) {
  // Убираем все пустые ячейки.
  const compactRow = row.filter((cell) => cell !== 0);

  const mergedRow = [];
  let score = 0;

  // Проходим по непустым плиткам строки.
  for (let i = 0; i < compactRow.length; i++) {
    // Если текущая и следующая плитки одинаковые,
    // объединяем их в одну.
    if (compactRow[i] === compactRow[i + 1]) {
      const mergedValue = compactRow[i] * 2;

      mergedRow.push(mergedValue);
      score += mergedValue;

      // Пропускаем следующую плитку,
      // так как она уже участвовала в объединении.
      i++;
    } else {
      // Если объединение невозможно,
      // просто добавляем текущую плитку.
      mergedRow.push(compactRow[i]);
    }
  }

  // Заполняем оставшиеся позиции нулями.
  while (mergedRow.length < row.length) {
    mergedRow.push(0);
  }

  return {
    row: mergedRow,
    score,
  };
}

// Выполняет движение всего игрового поля влево.
export function moveLeft(board) {
  let score = 0;

  // Обрабатываем каждую строку отдельно.
  const newBoard = board.map((row) => {
    const result = slideRowLeft(row);

    // Суммируем очки от объединений всех строк.
    score += result.score;

    return result.row;
  });

  return {
    board: newBoard,
    score,
  };
}

// Выполняет движение вправо.
// Используем разворот строк и уже готовый алгоритм движения влево.
export function moveRight(board) {
  const reversedBoard = reverseRows(board);
  const result = moveLeft(reversedBoard);

  return {
    board: reverseRows(result.board),
    score: result.score,
  };
}

// Выполняет движение вверх.
// Транспонируем поле, чтобы столбцы стали строками,
// после чего применяем движение влево.
export function moveUp(board) {
  const transposedBoard = transpose(board);

  const result = moveLeft(transposedBoard);

  return {
    board: transpose(result.board),
    score: result.score,
  };
}

// Выполняет движение вниз.
// Транспонируем поле, после чего применяем движение вправо.
export function moveDown(board) {
  const transposedBoard = transpose(board);

  const result = moveRight(transposedBoard);

  return {
    board: transpose(result.board),
    score: result.score,
  };
}

// Создаёт начальное игровое поле.
// В начале все ячейки пустые, после чего
// в две случайные ячейки добавляются плитки.
export function createInitialBoard() {
  let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // Добавляем две стартовые плитки.
  board = addRandomTile(board);
  board = addRandomTile(board);

  return board;
}

// Проверяет, выиграл ли игрок.
// Игра считается выигранной, если на поле есть плитка со значением 2048.
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