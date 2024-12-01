"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // To get query params if needed
import Board from "@/components/BoardDesign/Board";
import GameOver from "@/components/Modals/GameOver"
import Link from "next/link";

export default function ComputerRoomPage() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "Easy";
  const playerSymbol = searchParams.get("symbol") || "X";
  const computerSymbol = playerSymbol === "X" ? "O" : "X";

  const totalRounds = parseInt(searchParams.get("gameRound") || "1", 10);
  const firstTurn =
    searchParams.get("turn") === "Computer play first" ? "computer" : "player";

  const [grid, setGrid] = useState(Array(9).fill(null));
  // const [isPlayerTurn, setIsPlayerTurn] = useState(firstTurn === "player");
  const [winner, setWinner] = useState(null);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [computerMoves, setComputerMoves] = useState([]);
  const [currentRound, setCurrentRound] = useState(1); // Track the current round
  const [gameOver, setGameOver] = useState(false); // Track if all rounds are complete

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [tieScore, setTieScore] = useState(0);

  // Initialize isPlayerTurn based on the firstTurn parameter and currentRound
  const [isPlayerTurn, setIsPlayerTurn] = useState(
    (firstTurn === "player" && currentRound % 2 === 1) ||
      (firstTurn === "computer" && currentRound % 2 === 0)
  );

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
    setIsPlayerTurn(
      (firstTurn === "player" && currentRound % 2 === 1) ||
        (firstTurn === "computer" && currentRound % 2 === 0)
    );
  };

  useEffect(() => {
    if (winner) {
      // Update scores
      if (winner === playerSymbol) {
        setPlayerScore((prev) => prev + 1);
      } else if (winner === computerSymbol) {
        setComputerScore((prev) => prev + 1);
      } else if (winner === "Tie") {
        setTieScore((prev) => prev + 1);
      }

      if (currentRound < totalRounds) {
        setTimeout(() => {
          setCurrentRound((prev) => prev + 1);
          resetGame();
        }, 2000); // 2-second delay before starting the next round
      } else {
        setTimeout(() => {
          setGameOver(true);
        }, 3000); // 3-second delay before showing Game Over
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, currentRound, totalRounds]);

  const handlePlayerMove = (index) => {
    if (grid[index] || winner || !isPlayerTurn) return;

    const newGrid = [...grid];

    if (playerMoves.length >= 3) {
      const oldestMove = playerMoves[0];
      newGrid[oldestMove] = null;
      setPlayerMoves((prev) => prev.slice(1));  // Remove the first move after the 4th move
    }
    

    newGrid[index] = playerSymbol;
    setPlayerMoves((prev) => [...prev, index]);
    setGrid(newGrid);

    setWinner(checkWinner(newGrid));
    setIsPlayerTurn(false);
  };

  const getComputerMove = (grid) => {
    // If the grid is empty, we choose a random first move
    if (grid.every((cell) => cell === null)) {
      const availableSpots = grid
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);
      return availableSpots[Math.floor(Math.random() * availableSpots.length)]; // Random first move
    }

    if (difficulty === "Easy") {
      const blockMove = findWinningMove(grid, playerSymbol);
      if (blockMove !== null) return blockMove;

      const availableSpots = grid
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }

    if (difficulty === "Medium") {
      return minimax(grid, computerSymbol).index;
    }

    if (difficulty === "Hard") {
      return alphaBeta(grid, 0, -Infinity, Infinity, true).index;
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
      if (grid[a] === symbol && grid[b] === symbol && grid[c] === null)
        return c;
      if (grid[a] === symbol && grid[c] === symbol && grid[b] === null)
        return b;
      if (grid[b] === symbol && grid[c] === symbol && grid[a] === null)
        return a;
    }
    return null;
  };

  const minimax = (grid, player, depth = 0) => {
    const availableSpots = grid
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);

    const result = checkWinner(grid); // Check if the game is over
    if (result === playerSymbol) return { score: -10 + depth }; // Opponent win (penalize longer games)
    if (result === computerSymbol) return { score: 10 - depth }; // Computer win (reward faster wins)
    if (availableSpots.length === 0) return { score: 0 }; // Tie

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      grid[availableSpots[i]] = player; // Make the move

      // Recursive call based on the player
      const nextPlayer =
        player === computerSymbol ? playerSymbol : computerSymbol;
      const result = minimax(grid, nextPlayer, depth + 1); // Recursively calculate the score for the next player
      move.score = result.score;

      grid[availableSpots[i]] = null; // Undo the move
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

  // Alpha-Beta Pruning implementation
  const alphaBeta = (grid, depth, alpha, beta, isMaximizing) => {
    const availableSpots = grid
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);

    const result = checkWinner(grid);
    if (result === computerSymbol) return { score: 10 - depth };
    if (result === playerSymbol) return { score: -10 + depth };
    if (availableSpots.length === 0) return { score: 0 };

    let bestMove = {};
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const spot of availableSpots) {
        grid[spot] = computerSymbol;
        const evalResult = alphaBeta(grid, depth + 1, alpha, beta, false);
        grid[spot] = null;
        if (evalResult.score > maxEval) {
          maxEval = evalResult.score;
          bestMove = { index: spot, score: maxEval };
        }
        alpha = Math.max(alpha, maxEval);
        if (beta <= alpha) break; // Beta cut-off
      }
      return bestMove;
    } else {
      let minEval = Infinity;
      for (const spot of availableSpots) {
        grid[spot] = playerSymbol;
        const evalResult = alphaBeta(grid, depth + 1, alpha, beta, true);
        grid[spot] = null;
        if (evalResult.score < minEval) {
          minEval = evalResult.score;
          bestMove = { index: spot, score: minEval };
        }
        beta = Math.min(beta, minEval);
        if (beta <= alpha) break; // Alpha cut-off
      }
      return bestMove;
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner && !gameOver) {
      const move = getComputerMove(grid);

      if (move !== null) {
        setTimeout(() => {
          const newGrid = [...grid];

          if (computerMoves.length >= 3) {
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
 <GameOver
 player={{ name: "You", avatar: "/images/profileImage.jpg", score: playerScore }}
 computer={{ name: "Computer", avatar: "/images/profileImage.jpg", score: computerScore }}
 onRestart={() => {
   setCurrentRound(1);
   setGameOver(false);
   resetGame();
   setPlayerScore(0);
   setComputerScore(0);
   setTieScore(0);
   setIsPlayerTurn(firstTurn === "player");
 }}
 onHome={() => {
   window.location.href = "/";
 }}
/>

) : (
  <div className="mt-20 md:mt-32">
    <h1 className="text-2xl font-bold text-gray-700 text-center pb-5 uppercase">
      Round {currentRound} of {totalRounds}
    </h1>
    <Board grid={grid} onCellClick={handlePlayerMove} />
    {winner && (
      <p className="pt-5 uppercase text-center font-bold">
        {winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}
      </p>
    )}
  </div>
)}

    </div>
  );
}
