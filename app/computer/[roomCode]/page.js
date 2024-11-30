"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // To get query params if needed
import Board from "@/components/BoardDesign/Board";

export default function ComputerRoomPage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "Easy";
  const playerSymbol = searchParams.get("playerSymbol") || "X";
  const computerSymbol = playerSymbol === "X" ? "O" : "X";
  const totalRounds = parseInt(searchParams.get("gameRound") || "1", 10);
  const firstTurn = searchParams.get("firstTurn") === "computer" ? "computer" : "player";

  const [grid, setGrid] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(firstTurn === "player");
  const [winner, setWinner] = useState(null);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [computerMoves, setComputerMoves] = useState([]);
  const [currentRound, setCurrentRound] = useState(1); // Track the current round
  const [gameOver, setGameOver] = useState(false); // Track if all rounds are complete

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

  const resetGame = () => {
    setGrid(Array(9).fill(null));
    setPlayerMoves([]);
    setComputerMoves([]);
    setWinner(null);
    setIsPlayerTurn(firstTurn === "player" || currentRound % 2 === 0);
  };

  useEffect(() => {
    if (winner) {
      if (currentRound < totalRounds) {
        setTimeout(() => {
          setCurrentRound((prev) => prev + 1);
          resetGame();
        }, 2000); // 2-second delay before starting the next round
      } else {
        setGameOver(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, currentRound, totalRounds]);

  const handlePlayerMove = (index) => {
    if (grid[index] || winner || !isPlayerTurn) return;

    const newGrid = [...grid];

    if (playerMoves.length === 3) {
      const oldestMove = playerMoves[0];
      newGrid[oldestMove] = null;
      setPlayerMoves((prev) => prev.slice(1));
    }

    newGrid[index] = playerSymbol;
    setPlayerMoves((prev) => [...prev, index]);
    setGrid(newGrid);

    setWinner(checkWinner(newGrid));
    setIsPlayerTurn(false);
  };

  const getComputerMove = (grid) => {
    if (difficulty === "Easy") {
      const blockMove = findWinningMove(grid, playerSymbol);
      if (blockMove !== null) return blockMove;

      const availableSpots = grid
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }

    if (difficulty === "Medium") {
      const winningMove = findWinningMove(grid, computerSymbol);
      if (winningMove !== null) return winningMove;

      const blockMove = findWinningMove(grid, playerSymbol);
      if (blockMove !== null) return blockMove;

      const availableSpots = grid
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }

    if (difficulty === "Hard") {
      return minimax(grid, computerSymbol).index;
    }

    return null;
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
      if (grid[a] === symbol && grid[b] === symbol && grid[c] === null) return c;
      if (grid[a] === symbol && grid[c] === symbol && grid[b] === null) return b;
      if (grid[b] === symbol && grid[c] === symbol && grid[a] === null) return a;
    }
    return null;
  };

  const minimax = (grid, player) => {
    const availableSpots = grid
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);

    const result = checkWinner(grid);
    if (result === playerSymbol) return { score: -10 };
    if (result === computerSymbol) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      grid[availableSpots[i]] = player;

      move.score =
        player === computerSymbol
          ? minimax(grid, playerSymbol).score
          : minimax(grid, computerSymbol).score;

      grid[availableSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === computerSymbol) {
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
    if (!isPlayerTurn && !winner && !gameOver) {
      const move = getComputerMove(grid);

      if (move !== null) {
        setTimeout(() => {
          const newGrid = [...grid];

          if (computerMoves.length === 3) {
            const oldestMove = computerMoves[0];
            newGrid[oldestMove] = null;
            setComputerMoves((prev) => prev.slice(1));
          }

          newGrid[move] = computerSymbol;
          setComputerMoves((prev) => [...prev, move]);
          setGrid(newGrid);

          setWinner(checkWinner(newGrid));
          setIsPlayerTurn(true);
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, winner]);

  return (
    <div className="flex flex-col items-center mt-20">
      {gameOver ? (
        <h1 className="text-2xl font-bold text-gray-700">
          Game Over! All {totalRounds} rounds completed.
        </h1>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-700">
            Round {currentRound} of {totalRounds}
          </h1>
          <Board grid={grid} onCellClick={handlePlayerMove} />
          {winner && <p>{winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}</p>}
        </>
      )}
    </div>
  );
}
