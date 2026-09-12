/**
 * Утилиты для работы с localStorage
 */

/**
 * Загружает лучший результат для определённого размера доски
 * @param {number} boardSize - Размер доски
 * @returns {number} Лучший результат или 0
 */
export function loadBestScore(boardSize) {
  const value = localStorage.getItem(`bestScore${boardSize}`);
  return value ? parseInt(value, 10) : 0;
}

/**
 * Сохраняет лучший результат для определённого размера доски
 * @param {number} boardSize - Размер доски
 * @param {number} score - Результат для сохранения
 */
export function saveBestScore(boardSize, score) {
  localStorage.setItem(`bestScore${boardSize}`, String(score));
}

/**
 * Загружает все лучшие результаты для всех размеров досок
 * @param {Array<number>} boardSizes - Массив размеров досок
 * @returns {Object} Объект с лучшими результатами
 */
export function loadAllBestScores(boardSizes) {
  const bestScores = {};
  boardSizes.forEach((size) => {
    bestScores[size] = loadBestScore(size);
  });
  return bestScores;
}
