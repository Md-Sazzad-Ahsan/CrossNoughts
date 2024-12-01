"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Board from "@/components/BoardDesign/Board";

export default function RoomPage() {
  const { roomCode } = useParams();
  const searchParams = useSearchParams();

  const gameRound = searchParams.get("gameRound") || "Random";
  const turn = searchParams.get("turn") || "Random";
  const symbol = searchParams.get("symbol") || "Random";

  const [grid, setGrid] = useState(Array(9).fill(null));
  const [isHostTurn, setIsHostTurn] = useState(turn === "I play first");
  const [hostSymbol, setHostSymbol] = useState(symbol === "Random" ? "X" : symbol);
  const [opponentSymbol, setOpponentSymbol] = useState(
    hostSymbol === "X" ? "O" : "X"
  );
  const [hostMoves, setHostMoves] = useState([]);
  const [opponentMoves, setOpponentMoves] = useState([]);
  const [winner, setWinner] = useState(null);

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
    const currentSymbol = isHostTurn ? hostSymbol : opponentSymbol;
    const currentMoves = isHostTurn ? hostMoves : opponentMoves;

    if (currentMoves.length >= 3) {
      // Remove the oldest move
      const [firstMove, ...remainingMoves] = currentMoves;
      newGrid[firstMove] = null;
      currentMoves.splice(0, 1);
    }

    newGrid[index] = currentSymbol;
    currentMoves.push(index);

    if (isHostTurn) {
      setHostMoves([...currentMoves]);
    } else {
      setOpponentMoves([...currentMoves]);
    }

    setGrid(newGrid);
    setWinner(checkWinner(newGrid));
    setIsHostTurn(!isHostTurn);
  };

  useEffect(() => {
    // Ensure host and opponent symbols are correctly set based on URL params
    if (symbol === "Random") {
      const randomSymbol = Math.random() > 0.5 ? "X" : "O";
      setHostSymbol(randomSymbol);
      setOpponentSymbol(randomSymbol === "X" ? "O" : "X");
    }
    if (turn === "Random") {
      setIsHostTurn(Math.random() > 0.5);
    }
  }, [symbol, turn]);

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Two-Player Mode</h1>
      <h2 className="text-lg text-gray-600 mb-4">Room Code: {roomCode}</h2>
      <h3 className="text-sm text-gray-500 mb-4">
        Game Round: {gameRound} | Turn: {turn} | Symbol: {symbol}
      </h3>
      <Board grid={grid} onCellClick={handleMove} />
      {winner && (
        <p className="mt-4 text-lg font-semibold text-red-500">
          {winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}
        </p>
      )}
    </div>
  );
}
