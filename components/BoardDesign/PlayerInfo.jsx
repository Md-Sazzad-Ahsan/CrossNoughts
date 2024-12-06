import Image from "next/image";
import React from "react";

const PlayerInfo = ({ player1, player2, symbol, turn, isHost }) => {
  const player1Symbol = symbol === "X" ? "X" : "O";
  const player2Symbol = player1Symbol === "X" ? "O" : "X";

  const isPlayer1Turn = turn === player1;

  // Determine the current player's and opponent's info
  const currentPlayerName = isHost ? player1 : player2;
  const currentPlayerSymbol = isHost ? player1Symbol : player2Symbol;
  const currentPlayerImage = isHost ? "/images/profileImage.jpg" : "/images/computerImage.jpg";

  const opponentName = isHost ? player2 : player1;
  const opponentSymbol = isHost ? player2Symbol : player1Symbol;
  const opponentImage = isHost ? "/images/computerImage.jpg" : "/images/profileImage.jpg";

  // Symbol color
  const getSymbolColor = (symbol) => (symbol === "X" ? "text-blue-500" : "text-red-500");

  return (
    <div className="flex justify-between mb-5 gap-2 w-full max-w-3xl mx-auto">
      {/* Current Player Box (always on the left) */}
      <div
        className={`flex items-center justify-between border rounded-md px-3 py-2 w-1/2 
          ${turn === currentPlayerName ? "bg-gray-700 shadow-lg scale-105" : "bg-gray-600 border-gray-400 opacity-70"}`}
      >
        <Image
          src={currentPlayerImage}
          alt="Your Avatar"
          height={48}
          width={48}
          loading="lazy"
          className="w-8 h-8 rounded-full border border-gray-400"
        />
        <p className="font-bold text-white mx-2">{currentPlayerName}</p>
        <p className={`text-xl font-bold text-end ${getSymbolColor(currentPlayerSymbol)}`}>{currentPlayerSymbol}</p>
      </div>

      {/* Opponent Box (always on the right) */}
      <div
        className={`flex items-center justify-between border rounded-md px-3 py-2 w-1/2 
          ${turn === opponentName ? "bg-gray-700 shadow-lg scale-105" : "bg-gray-600 border-gray-400 opacity-70"}`}
      >
        <p className={`text-xl font-bold ${getSymbolColor(opponentSymbol)}`}>{opponentSymbol}</p>
        <p className="text-end font-bold text-white mx-2">{opponentName}</p>
        <Image
          src={opponentImage}
          alt="Opponent Avatar"
          height={48}
          width={48}
          loading="lazy"
          className="w-8 h-8 rounded-full border border-gray-400"
        />
      </div>
    </div>
  );
};

export default PlayerInfo;
