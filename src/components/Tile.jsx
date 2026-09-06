const Tile = ({ value }) => {
    // Определяем класс для плитки в зависимости от её значения.
    return (
        <div className={`cell tile-${value}`}>
            {value !== 0 ? value : ""}
        </div>
    );
};

export default Tile;