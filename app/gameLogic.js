export const createInitialGrid = () => Array(9).fill(null);

export const getNextPlayer = (isXTurn) => (isXTurn ? 'X' : 'O');

// Define winning combinations
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal (top-left to bottom-right)
  [2, 4, 6], // Diagonal (top-right to bottom-left)
];

// Check if a player has won
export const checkWinner = (grid) => {
  for (let combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a]; // Return the winner ('X' or 'O')
    }
  }
  return null; // No winner yet
};

export const handleCellClick = (
    grid,
    index,
    isXTurn,
    playerPositions,
    setGrid,
    setIsXTurn,
    setPlayerPositions,
    setWinner,
    winner
  ) => {
    // Prevent input if the cell is filled or there's a winner
    if (grid[index] || winner) return;
  
    const currentPlayer = isXTurn ? 'X' : 'O';
    const newGrid = [...grid];
    const newPlayerPositions = { ...playerPositions };
  
    // Update player's positions
    if (!newPlayerPositions[currentPlayer]) {
      newPlayerPositions[currentPlayer] = [];
    }
  
    newPlayerPositions[currentPlayer].push(index);
  
    // Remove the oldest position if the player already has 3
    if (newPlayerPositions[currentPlayer].length > 3) {
      const oldestPosition = newPlayerPositions[currentPlayer].shift(); // Remove the first position
      newGrid[oldestPosition] = null; // Clear the grid at the oldest position
    }
  
    // Update the grid
    newGrid[index] = currentPlayer;
    setGrid(newGrid);
    setPlayerPositions(newPlayerPositions);
  
    // Check for a winner
    const winnerResult = checkWinner(newGrid);
    if (winnerResult) {
      setWinner(winnerResult);
    } else {
      setIsXTurn(!isXTurn); // Switch turns if no winner
    }
  };
  

export const resetGame = (setGrid, setIsXTurn, setPlayerPositions, setWinner) => {
  setGrid(createInitialGrid());
  setIsXTurn(true);
  setPlayerPositions({ X: [], O: [] });
  setWinner(null);
};
