const StartScreen = ({ onStart }) => {
  const SIZES = [4, 5, 6, 8];

  return (
    <div className="start-screen">
      <h1>2048</h1>

      <h2>Выберите размер поля</h2>

      <div className="size-buttons">
        {SIZES.map((size) => (
          <button key={size} onClick={() => onStart(size)}>
            {size} × {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StartScreen;
