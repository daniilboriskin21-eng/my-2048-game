import Tile from "./Tile";

const GameBoard = ({ board, newTile, mergedTiles }) => {
  return (
    <div className="game">
      {/* Преобразуем двумерный массив board
            в набор React-компонентов. */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            isNew={
              newTile && newTile.row === rowIndex && newTile.col === colIndex
            }
            isMerged={mergedTiles.some(
              (tile) => tile.row === rowIndex && tile.col === colIndex,
            )}
          />
        )),
      )}
    </div>
  );
};

export default GameBoard;
