'use client';
import React, { useState } from 'react';
import Board from '../components/BoardDesign/Board';
import {
  createInitialGrid,
  getNextPlayer,
  handleCellClick,
  resetGame,
} from './gameLogic';

export default function Home() {
  const [grid, setGrid] = useState(createInitialGrid());
  const [isXTurn, setIsXTurn] = useState(true);
  const [playerPositions, setPlayerPositions] = useState({ X: [], O: [] });
  const [winner, setWinner] = useState(null);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      {/* Player Turn or Winner Indicator */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Cross Noughts</h1>
        {!winner ? (
          <p className="mt-2 text-lg font-semibold text-gray-600">
            Current Turn: <span className={`text-${isXTurn ? 'blue-500' : 'pink-500'}`}>{getNextPlayer(isXTurn)}</span>
          </p>
        ) : (
          <p className="mt-2 text-lg font-bold text-green-500">
            🎉 Winner: {winner} 🎉
          </p>
        )}
      </div>

      {/* Game Board */}
      <Board
        grid={grid}
        onCellClick={(index) =>
          handleCellClick(
            grid,
            index,
            isXTurn,
            playerPositions,
            setGrid,
            setIsXTurn,
            setPlayerPositions,
            setWinner,
            winner
          )
        }
      />

      {/* Reset Button */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          onClick={() => resetGame(setGrid, setIsXTurn, setPlayerPositions, setWinner)}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
