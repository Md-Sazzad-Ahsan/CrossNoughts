"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // To get query params if needed
import Board from "@/components/BoardDesign/Board";

export default function ComputerRoomPage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "Easy"; // Set difficulty from params, default to Medium

  const [grid, setGrid] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [computerMoves, setComputerMoves] = useState([]);

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

  const handlePlayerMove = (index) => {
    if (grid[index] || winner || !isPlayerTurn) return;
  
    const newGrid = [...grid];
  
    // Clear the oldest move if the player already has 3 moves
    if (playerMoves.length === 3) {
      const oldestMove = playerMoves[0];
      newGrid[oldestMove] = null; // Clear the oldest move
      setPlayerMoves((prev) => prev.slice(1)); // Remove from playerMoves array
    }
  
    // Add the new move
    newGrid[index] = "X";
    setPlayerMoves((prev) => [...prev, index]); // Add the new move to playerMoves
    setGrid(newGrid);
  
    // Check for winner and pass the turn
    setWinner(checkWinner(newGrid));
    setIsPlayerTurn(false);
  };
  
  
  const getComputerMove = (grid) => {
    // Easy Mode: Random move with a simple block strategy
    if (difficulty === "Easy") {
      // 1. Try to block player if they have 2 symbols in a line
      const blockMove = findWinningMove(grid, "X");
      if (blockMove !== null) return blockMove;
  
      // 2. Random move if no block is needed
      const availableSpots = grid
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }
  
    // Medium Mode: Block or Win strategy
    if (difficulty === "Medium") {
      // 1. Try to win
      const winningMove = findWinningMove(grid, "O");
      if (winningMove !== null) return winningMove;
  
      // 2. Try to block the player
      const blockMove = findWinningMove(grid, "X");
      if (blockMove !== null) return blockMove;
  
      // 3. Fallback to random move
      const availableSpots = grid
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }
  
    // Hard Mode: Minimax for perfect play
    if (difficulty === "Hard") {
      return minimax(grid, "O").index;
    }
  
    return null; // Fallback if something goes wrong
  };
  

  const findWinningMove = (grid, symbol) => {
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
      if (
        grid[a] === symbol &&
        grid[b] === symbol &&
        grid[c] === null
      )
        return c;
      if (
        grid[a] === symbol &&
        grid[c] === symbol &&
        grid[b] === null
      )
        return b;
      if (
        grid[b] === symbol &&
        grid[c] === symbol &&
        grid[a] === null
      )
        return a;
    }
    return null;
  };

  const minimax = (grid, player) => {
    const availableSpots = grid
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);
  
    const result = checkWinner(grid);
    if (result === "X") return { score: -10 }; // Player wins
    if (result === "O") return { score: 10 };  // Computer wins
    if (availableSpots.length === 0) return { score: 0 }; // Tie
  
    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      grid[availableSpots[i]] = player;
  
      // Recursive call
      if (player === "O") {
        move.score = minimax(grid, "X").score;
      } else {
        move.score = minimax(grid, "O").score;
      }
  
      grid[availableSpots[i]] = null; // Undo move
      moves.push(move);
    }
  
    // Determine the best move
    let bestMove;
    if (player === "O") {
      let bestScore = -Infinity;
      for (const move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }
  
    return bestMove;
  };
  

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const move = getComputerMove(grid);
  
      if (move !== null) {
        setTimeout(() => {
          const newGrid = [...grid];
  
          // Clear the oldest move if the computer already has 3 moves
          if (computerMoves.length === 3) {
            const oldestMove = computerMoves[0];
            newGrid[oldestMove] = null; // Clear the oldest move
            setComputerMoves((prev) => prev.slice(1)); // Remove from computerMoves array
          }
  
          // Add the new move
          newGrid[move] = "O";
          setComputerMoves((prev) => [...prev, move]); // Add the new move to computerMoves
          setGrid(newGrid);
  
          // Check for winner and pass the turn
          setWinner(checkWinner(newGrid));
          setIsPlayerTurn(true);
        }, 1000); // Delay of 1 second
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, winner]);
  
  
  

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold text-gray-700">Player vs Computer Mode</h1>
      <Board grid={grid} onCellClick={handlePlayerMove} />
      {winner && <p>{winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}</p>}
    </div>
  );
}
