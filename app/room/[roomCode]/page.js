"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Board from "@/components/BoardDesign/Board";
import GameOver from "@/components/Modals/GameOver";
import PlayerInfo from "@/components/BoardDesign/PlayerInfo";

export default function RoomPage() {
  const { roomCode } = useParams();
  const searchParams = useSearchParams();
  const gameRound = parseInt(searchParams.get("gameRound")) || 1;
  const turn = searchParams.get("turn");
  const symbol = searchParams.get("symbol");

  const [grid, setGrid] = useState(Array(9).fill(null));
  const [isHostTurn, setIsHostTurn] = useState(turn === "host");
  const [hostSymbol, setHostSymbol] = useState(symbol);
  const [opponentSymbol, setOpponentSymbol] = useState(
    symbol === "X" ? "O" : "X"
  );
  const [hostMoves, setHostMoves] = useState([]);
  const [opponentMoves, setOpponentMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [roundCount, setRoundCount] = useState(1); // Current round
  const [hostWins, setHostWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [tieCount, setTieCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showRoundText, setShowRoundText] = useState(true);

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
    const currentMoves = isHostTurn ? [...hostMoves] : [...opponentMoves]; // Create a new copy
  
    if (currentMoves.length >= 3) {
      const [firstMove, ...remainingMoves] = currentMoves;
      newGrid[firstMove] = null;
      currentMoves.splice(0, 1);
    }
  
    newGrid[index] = currentSymbol;
    currentMoves.push(index);
  
    if (isHostTurn) {
      setHostMoves(currentMoves); // Always set the new state
    } else {
      setOpponentMoves(currentMoves); // Same here
    }
  
    setGrid(newGrid);
    const result = checkWinner(newGrid);
    setWinner(result);
  
    if (result) {
      if (result === hostSymbol) {
        setHostWins(hostWins + 1);
      } else if (result === opponentSymbol) {
        setOpponentWins(opponentWins + 1);
      } else if (result === "Tie") {
        setTieCount(tieCount + 1);
      }
    }
  
    setIsHostTurn(!isHostTurn);
  };
  
  const resetRound = () => {
    setGrid(Array(9).fill(null));
    setHostMoves([]);
    setOpponentMoves([]);
    setWinner(null);
    setIsHostTurn(turn === "host");
  };

  const resetGame = () => {
    setRoundCount(1);
    setHostWins(0);
    setOpponentWins(0);
    setTieCount(0);
    setGameOver(false);
    resetRound();
  };

  useEffect(() => {
    // Show the round text initially, then hide it after 2 seconds
    setShowRoundText(true);
    const timeout = setTimeout(() => {
      setShowRoundText(false);
    }, 2000);

    // Cleanup the timeout on component unmount or before next effect runs
    return () => clearTimeout(timeout);
  }, [roundCount]); // Re-run this effect whenever the round count changes

  useEffect(() => {
    if (winner && roundCount < gameRound) {
      setTimeout(() => {
        resetRound();
        setRoundCount(roundCount + 1);
      }, 2000); // Delay before starting the next round
    } else if (winner && roundCount === gameRound) {
      setTimeout(() => {
        setGameOver(true); // Delay before showing the game-over modal
      }, 2000); // Adjust this delay as needed
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const player1 = "You";
  const player2 = "Player 2";
  const currentTurn = isHostTurn ? player1 : player2;
  
  return (
    <div className="flex flex-col items-center mt-20">
      {gameOver ? (
        <GameOver
          player={{
            name: "You",
            avatar: "/images/profileImage.jpg",
            score: hostWins,
          }}
          computer={{
            name: "Player 2",
            avatar: "/images/profileImage.jpg",
            score: opponentWins,
          }}
          onRestart={resetGame}
          onHome={() => (window.location.href = "/")}
        />
      ) : (
        <div className="mt-20">
          <div className="mb-10">
          <PlayerInfo
            player1={player1}
            player2={player2}
            symbol={hostSymbol}
            turn={currentTurn}
          />
          </div>
          <Board grid={grid} onCellClick={handleMove} />
          {showRoundText && (
        <h1 className="text-sm font-bold text-gray-400 text-center py-5 uppercase">
          Round {roundCount} of {gameRound}
        </h1>
      )}
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
