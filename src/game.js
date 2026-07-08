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

export function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

export function transpose(board) {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
}

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

export function isGameOver(board) {
  if (findEmptyCells(board).length) {
    return false;
  }

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (col < board[row].length - 1) {
        if (board[row][col] === board[row][col + 1]) return false;
      }

      if (row < board.length - 1) {
        if (board[row][col] === board[row + 1][col]) return false;
      }
    }
  }

  return true;
}

export function getRandomEmptyCell(empty) {
  const index = Math.floor(Math.random() * empty.length);
  return empty[index];
}

export function getRandomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

export function addRandomTile(board) {
  const emptyCells = findEmptyCells(board);

  if (emptyCells.length === 0) {
    return board;
  }

  const newBoard = board.map((row) => [...row]);

  const randomCell = getRandomEmptyCell(emptyCells);
  const value = getRandomTileValue();

  newBoard[randomCell.row][randomCell.col] = value;

  return newBoard;
}

export function slideRowLeft(row) {
  const compactRow = row.filter((cell) => cell !== 0);

  const mergedRow = [];
  let score = 0;

  for (let i = 0; i < compactRow.length; i++) {
    if (compactRow[i] === compactRow[i + 1]) {
      const mergedValue = compactRow[i] * 2;

      mergedRow.push(mergedValue);
      score += mergedValue;

      i++;
    } else {
      mergedRow.push(compactRow[i]);
    }
  }

  while (mergedRow.length < row.length) {
    mergedRow.push(0);
  }

  return {
    row: mergedRow,
    score,
  };
}

export function moveLeft(board) {
  let score = 0;

  const newBoard = board.map((row) => {
    const result = slideRowLeft(row);

    score += result.score;

    return result.row;
  });

  return {
    board: newBoard,
    score,
  };
}

export function moveRight(board) {
  const reversedBoard = reverseRows(board);
  const result = moveLeft(reversedBoard);

  return {
    board: reverseRows(result.board),
    score: result.score,
  };
}

export function moveUp(board) {
  const transposedBoard = transpose(board);

  const result = moveLeft(transposedBoard);

  return {
    board: transpose(result.board),
    score: result.score,
  };
}

export function moveDown(board) {
  const transposedBoard = transpose(board);

  const result = moveRight(transposedBoard);

  return {
    board: transpose(result.board),
    score: result.score,
  };
}

export function createInitialBoard() {
  let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  board = addRandomTile(board);
  board = addRandomTile(board);

  return board;
}