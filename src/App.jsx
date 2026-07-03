import { useEffect, useState } from "react";
import "./App.css";

function boardsEqual(board1, board2) {
  for (let row = 0; row < board1.length; row++) {
    for (let col = 0; col < board1[row].length; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  return true;
}

function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

function transpose(board) {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
}

function findEmptyCells(board) {
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

function getRandomEmptyCell(empty) {
  const index = Math.floor(Math.random() * empty.length);
  return empty[index];
}

function getRandomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function addRandomTile(board) {
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

function slideRowLeft(row) {
  const compactRow = row.filter((cell) => cell !== 0);

  const mergedRow = [];

  for (let i = 0; i < compactRow.length; i++) {
    if (compactRow[i] === compactRow[i + 1]) {
      mergedRow.push(compactRow[i] * 2);
      i++;
    } else {
      mergedRow.push(compactRow[i]);
    }
  }

  while (mergedRow.length < row.length) {
    mergedRow.push(0);
  }

  return mergedRow;
}

function moveLeft(board) {
  return board.map(slideRowLeft);
}

function moveRight(board) {
  const reversedBoard = reverseRows(board);
  const movedBoard = moveLeft(reversedBoard);
  return reverseRows(movedBoard);
}

function moveUp(board) {
  const transposedBoard = transpose(board);
  const movedBoard = moveLeft(transposedBoard);
  return transpose(movedBoard);
}

function moveDown(board) {
  const transposedBoard = transpose(board);
  const movedBoard = moveRight(transposedBoard);
  return transpose(movedBoard);
}

function App() {
  const [board, setBoard] = useState([
    [2, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  useEffect(() => {
    function handleKeyDown(event) {
      setBoard((prevBoard) => {
        let movedBoard;

        switch (event.key) {
          case "ArrowLeft":
            movedBoard = moveLeft(prevBoard);
            break;
          case "ArrowRight":
            movedBoard = moveRight(prevBoard);
            break;
          case "ArrowUp":
            movedBoard = moveUp(prevBoard);
            break;
          case "ArrowDown":
            movedBoard = moveDown(prevBoard);
            break;
          default:
            return prevBoard;
        }

        if (boardsEqual(prevBoard, movedBoard)) {
          return prevBoard;
        }

        return addRandomTile(movedBoard);
      });
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setBoard((prev) => addRandomTile(prev));
        }}
      >
        Add tile
      </button>
      <div className="game">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="cell">
              {cell !== 0 ? cell : ""}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

export default App;
