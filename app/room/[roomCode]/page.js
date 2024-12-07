"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ref, get, onValue, update } from "firebase/database"; // Firebase functions
import { db } from "@/app/firebaseConfig"; // Firebase functions
import GameOver from "@/components/Modals/GameOver";
import Waiting from "@/components/Modals/Waiting"; // Assuming your modal is here

import PlayerInfo from "@/components/BoardDesign/PlayerInfo";

const Board = ({ grid, onCellClick }) => {
  if (!Array.isArray(grid)) {
    console.error("Grid is not an array:", grid);
    return <div>Error: Grid is not an array.</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-5 bg-white border border-gray-200 rounded-lg shadow-sm md:shadow-md mx-auto max-w-3xl">
      {grid.map((cell, index) => (
        <div
          key={index}
          className={`w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center border border-gray-200 md:border-gray-300 rounded-md shadow-sm
                      text-4xl font-bold cursor-pointer hover:bg-gray-100 transition-transform ${
                        cell === "X"
                          ? "text-blue-500"
                          : cell === "O"
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
          onClick={() => {
            if (!cell) {
              // Only allow click if the cell is empty
              onCellClick(index);
            }
          }}
        >
          {cell || ""}
        </div>
      ))}
    </div>
  );
};

export default function RoomPage() {
  const { roomCode } = useParams();
  const searchParams = useSearchParams();
  const playerOneIdFromUrl = searchParams.get("playerOneId");
  const playerTwoIdFromUrl = searchParams.get("playerTwoId");

  const [board, setBoard] = useState(Array(9).fill(null));
  const [hostSymbol, setHostSymbol] = useState("X");
  const [opponentSymbol, setOpponentSymbol] = useState("O");
  const [hostMoves, setHostMoves] = useState([]);
  const [opponentMoves, setOpponentMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [roundCount, setRoundCount] = useState(1);
  const [hostWins, setHostWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [tieCount, setTieCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showRoundText, setShowRoundText] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [playerRole, setPlayerRole] = useState(null); 
  const [gameRound, setGameRound] = useState(1); 
  const [playerTwoId, setPlayerTwoId] = useState(""); 
  const [status, setStatus] = useState("waiting"); 

  const roomRef = ref(db, `rooms/${roomCode}`); 

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          initializeGame(roomData);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    const initializeGame = (roomData) => {
      // Safely initialize Board as an array if it's undefined or not an array
      const initialBoard = Array.isArray(roomData.board)
        ? roomData.board
        : Array(9).fill("");
      setBoard(initialBoard);
      // Initialize player symbols
      const playerOneSym = roomData.playerOneSym || "X"; // Default to "X" for Player 1
      const playerTwoSym = roomData.playerTwoSym || "O"; // Default to "O" for Player 2
      setPlayerTwoId(roomData.playerTwoId || "");
      setStatus(roomData.status);
      setStatus(playerTwoIdFromUrl ? "ready" : "waiting");

      // Assign the correct symbols based on player role
      setHostSymbol(playerOneSym); // Host gets player one symbol
      setOpponentSymbol(playerTwoSym); // Opponent gets player two symbol
      setStatus(roomData.status);
      setGameRound(roomData.gameRound || 1);

      // Determine the current player role
      const localPlayerId = localStorage.getItem("playerId");
      if (localPlayerId === playerOneIdFromUrl) {
        setPlayerRole("host"); // Player 1 is the host
        setCurrentTurn(roomData.currentTurn || "host");
      } else if (localPlayerId === playerTwoIdFromUrl) {
        setPlayerRole("opponent"); // Player 2 is the opponent
        setCurrentTurn(roomData.currentTurn || "host");
      }

      // Set initial game state
      setWinner(roomData.winner || null);
      setHostMoves(roomData.hostMoves || []);
      setOpponentMoves(roomData.opponentMoves || []);
    };

    fetchRoomData();

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.val();
        setStatus(roomData.status);
        const updatedBoard = Array.isArray(roomData.board)
          ? roomData.board
          : Array(9).fill(null);
       
        setBoard(updatedBoard);
        setPlayerTwoId(roomData.playerTwoId || "");
        setCurrentTurn(roomData.currentTurn || "host");
        setWinner(roomData.winner || null);
        setHostMoves(roomData.hostMoves || []);
        setOpponentMoves(roomData.opponentMoves || []);
      }
    });

    return () => unsubscribe();
  }, [roomRef, playerOneIdFromUrl, playerTwoIdFromUrl]);

  const checkWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes("") ? "" : "Tie";
  };

  const handleMove = async (index) => {
    if (
      board[index] || // Cell already occupied
      winner || // Game already has a winner
      (playerRole === "host" && currentTurn !== "host") || // Not host's turn
      (playerRole === "opponent" && currentTurn !== "opponent") // Not opponent's turn
    ) {
      return;
    }

    const currentSymbol = playerRole === "host" ? hostSymbol : opponentSymbol;
    const isHost = playerRole === "host";
    const currentMoves = isHost ? [...hostMoves] : [...opponentMoves];

    // Add the new move to the player's moves
    currentMoves.push(index);

    // If the player already has 3 moves, remove the oldest move
    if (currentMoves.length > 3) {
      const oldestMove = currentMoves.shift(); // Remove the oldest move
      board[oldestMove] = ""; // Clear the oldest move from the board
    }

    // Update the board with the new move
    const newBoard = [...board];
    newBoard[index] = currentSymbol;

    // Update the local state
    if (isHost) {
      setHostMoves(currentMoves);
    } else {
      setOpponentMoves(currentMoves);
    }

    setBoard(newBoard);

    // Check for a winner
    const result = checkWinner(newBoard);
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

    // Switch turn
    const newTurn = currentTurn === "host" ? "opponent" : "host";
    setCurrentTurn(newTurn);

    // Update Firebase
    try {
      await update(roomRef, {
        board: newBoard,
        hostMoves: isHost ? currentMoves : hostMoves,
        opponentMoves: isHost ? opponentMoves : currentMoves,
        winner: result,
        currentTurn: newTurn,
      });
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };

  useEffect(() => {
    setShowRoundText(true);
    const timeout = setTimeout(() => setShowRoundText(false), 2000);
    return () => clearTimeout(timeout);
  }, [roundCount]);

useEffect(() => {
  if (winner && roundCount < gameRound) {
    setTimeout(() => {
      // Update roundCount before resetting the round
      setRoundCount((prevRoundCount) => prevRoundCount + 1); // Increment round count first

      // Reset the round (clear board, moves, winner, etc.)
      resetRound(); // Now reset the round with the correct updated roundCount
    }, 2000); // Delay for showing winner message
  } else if (winner && roundCount === gameRound) {
    // After the final round, set game over
    setTimeout(() => {
      setGameOver(true); // End game after the final round
    }, 2000); // Delay for showing game over message
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [winner, roundCount, gameRound]);


  const resetRound = async () => {
    // Clear the board locally
    setBoard(Array(9).fill("")); // Clear the board
    setHostMoves([]); // Clear host's moves
    setOpponentMoves([]); // Clear opponent's moves
    setWinner(null); // Clear the winner
    setCurrentTurn("host"); // Reset the turn to the host (or whoever starts)

    // Update Firebase with the cleared board and winner but retain other state
    try {
      await update(roomRef, {
        board: Array(9).fill(""), // Clear the board in Firebase
        winner: null, // Reset winner in Firebase
        hostMoves: [], // Clear host's moves in Firebase
        opponentMoves: [], // Clear opponent's moves in Firebase
      });
    } catch (error) {
      console.error("Error resetting round:", error);
    }
  };

  const resetGame = async () => {
    // Reset the board and winner locally
    setBoard(Array(9).fill("")); // Clear the board
    setWinner(null); // Reset winner
    setHostMoves([]); // Clear host's moves
    setOpponentMoves([]); // Clear opponent's moves
    setRoundCount(1); // Reset round count

    // Update Firebase with the cleared board and winner but retain other state
    try {
      await update(roomRef, {
        board: Array(9).fill(""), // Clear the board in Firebase
        winner: null, // Reset winner in Firebase
        hostMoves: [], // Clear host moves in Firebase
        opponentMoves: [], // Clear opponent moves in Firebase
      });
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  const handleGameStart = () => {
    const gameRef = ref(db, `rooms/${roomCode}`);
    update(gameRef, { status: "ongoing" })
      .then(() => {
        console.log("Game status updated to 'ongoing'.");
        // Update local state to trigger re-render and close the modal
        setStatus("ongoing");  // Make sure to set the local state as well
      })
      .catch((error) => console.error("Error updating game status:", error));
  };
  
  

  const player1 = playerRole === "host" ? "You" : "Player 2";
  const player2 = playerRole === "opponent" ? "You" : "Player 2";

  return (
    <div className="flex flex-col items-center mt-20">
  {status === "waiting" || status === "ready" ? (
  <Waiting
    playerOneId={playerOneIdFromUrl}
    playerTwoId={playerTwoId}
    playerOneSym={hostSymbol} // The host symbol, likely "X"
    playerTwoSym={opponentSymbol} // The opponent symbol, likely "O"
    roomCode={roomCode} // Pass the room code
    onStart={handleGameStart}
  />
) : gameOver ? (

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
          onRestart={resetGame} // Pass the resetGame function here
          onHome={() => (window.location.href = "/")}
        />
      ) : (
        <div className="mt-20">
          <div className="mb-10">
            <PlayerInfo
              player1={player1}
              player2={player2}
              symbol={hostSymbol}
              turn={currentTurn === "host" ? player1 : player2}
              isHost={playerRole === "host"} // Pass the player's role
            />
          </div>
          <Board grid={board} onCellClick={handleMove} />

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
