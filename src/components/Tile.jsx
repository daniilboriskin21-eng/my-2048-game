const Tile = ({ value, isNew, isMerged, movement }) => {
  let style;

  if (movement) {
    const cellSize = 90;

    const dx = (movement.from.col - movement.to.col) * cellSize;
    const dy = (movement.from.row - movement.to.row) * cellSize;

    style = {
      "--move-x": `${dx}px`,
      "--move-y": `${dy}px`,
    };
  }

  // Определяем класс для плитки в зависимости от её значения.
  return (
    <div
      className={`cell tile-${value} 
        ${isNew ? "tile-new" : ""} 
        ${isMerged ? "tile-merge" : ""} 
        ${movement ? "tile-move" : ""}`}
      style={style}
    >
      {value !== 0 ? value : ""}
    </div>
  );
};

export default Tile;
