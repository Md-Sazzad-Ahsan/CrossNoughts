import Image from "next/image";
import React from "react";

const PlayerInfo = ({ player1, player2, symbol, turn }) => {
  const player1Symbol = symbol === "X" ? "X" : "O";
  const player2Symbol = player1Symbol === "X" ? "O" : "X";
  const isPlayer1Turn = turn === player1;

  // Define the color for each symbol
  const getSymbolColor = (symbol) => {
    return symbol === "X" ? "text-blue-500" : "text-red-500";
  };

  return (
    <div className="flex justify-between mb-5 w-full mx-auto max-w-3xl gap-2">
      {/* Player 1 */}
      <div
        className={`flex items-center justify-between border rounded-md px-2 py-1 w-1/2 
          ${
            isPlayer1Turn
              ? "bg-gray-700 shadow-lg scale-105"
              : "bg-gray-600 border-gray-400 opacity-70"
          }`}
      >
        <div className="flex items-center justify-between space-x-2">
          <Image
            src="/images/profileImage.jpg"
            alt="Avatar"
            height={64}
            width={64}
            loading="lazy"
            className="w-5 h-5 rounded-full border border-gray-400"
          />
          <p className="font-bold text-white">{player1}</p>
        </div>
        <p className={`text-xl font-bold ${getSymbolColor(player1Symbol)}`}>
          {player1Symbol}
        </p>
      </div>

      {/* Player 2 */}
      <div
        className={`flex items-center justify-between border rounded-md px-2 py-1 w-1/2 
          ${
            !isPlayer1Turn
              ? "bg-gray-700 shadow-lg scale-105"
              : "bg-gray-600 border-gray-400 opacity-70"
          }`}
      >
        <p className={`text-xl font-bold ${getSymbolColor(player2Symbol)}`}>
          {player2Symbol}
        </p>
        <div className="flex items-center space-x-3">
          <p className="font-bold text-white">{player2}</p>
          <Image
            src="/images/computerImage.jpg"
            alt="Avatar"
            height={64}
            width={64}
            loading="lazy"
            className="w-5 h-5 rounded-full border border-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
