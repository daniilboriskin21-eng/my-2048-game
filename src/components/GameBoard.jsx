import Tile from "./Tile";

const GameBoard = ({ board }) => {
  return (
    <div className="game">
      {/* Преобразуем двумерный массив board
            в набор React-компонентов. */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={cell} />
        )),
      )}
    </div>
  );
};

export default GameBoard;
