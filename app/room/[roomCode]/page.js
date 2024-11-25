"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Board from "@/components/BoardDesign/Board";

export default function RoomPage() {
  const { roomCode } = useParams();
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [xMoves, setXMoves] = useState([]);
  const [oMoves, setOMoves] = useState([]);

  const checkWinner = (grid) => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return grid[a];
      }
    }
    return grid.includes(null) ? null : "Tie";
  };

  const handleMove = (index) => {
    if (grid[index] || winner) return;

    const newGrid = [...grid];
    const currentSymbol = isXTurn ? "X" : "O";

    if (isXTurn) {
      if (xMoves.length >= 3) {
        newGrid[xMoves[0]] = null;
        setXMoves(xMoves.slice(1));
      }
      setXMoves([...xMoves, index]);
    } else {
      if (oMoves.length >= 3) {
        newGrid[oMoves[0]] = null;
        setOMoves(oMoves.slice(1));
      }
      setOMoves([...oMoves, index]);
    }

    newGrid[index] = currentSymbol;
    setGrid(newGrid);
    setWinner(checkWinner(newGrid));
    setIsXTurn(!isXTurn);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Two-Player Mode</h1>
      <h2 className="text-lg text-gray-600 mb-4">Room Code: {roomCode}</h2>
      <Board grid={grid} onCellClick={handleMove} />
      {winner && (
        <p className="mt-4 text-lg font-semibold text-red-500">
          {winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}
        </p>
      )}
    </div>
  );
}
