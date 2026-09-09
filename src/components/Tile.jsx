const Tile = ({ value, isNew, isMerged }) => {
  // Определяем класс для плитки в зависимости от её значения.
  return (
    <div
      className={`cell tile-${value} ${isNew ? "tile-new" : ""} ${isMerged ? "tile-merge" : ""}`}
    >
      {value !== 0 ? value : ""}
    </div>
  );
};

export default Tile;
