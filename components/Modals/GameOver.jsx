import Image from "next/image";
import React from "react";

const WinnerLoserModal = ({ player, computer, onRestart, onHome }) => {
  // Determine the winner and loser based on scores
  const isPlayerWinner = player.score > computer.score;
  const winner = isPlayerWinner ? player : computer;
  const loser = isPlayerWinner ? computer : player;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-700 w-11/12 max-w-md">
        {/* Title */}
        <h2 className="text-4xl font-bold my-12">Game Over!</h2>

        {/* Winner Section */}
        <div className="mb-4 mx-3 border border-gray-200 p-3 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            {/* Winner Avatar */}
            <div className="flex items-center gap-4">
              <Image
                src={winner.avatar}
                alt={`${winner.name} Avatar`}
                height={64}
                width={64}
                loading="lazy"
                className="w-10 h-10 rounded-full border border-gray-400"
              />
              <div>
                <p className=" font-bold text-left text-gray-800">{winner.name} (Winner)</p>
                <p className="text-sm text-gray-600 text-left">Score: {winner.score}</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-700">#1</span>
          </div>
        </div>

        {/* Loser Section */}
        <div className="mx-3 border border-gray-200 p-3 rounded-lg shadow-sm bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Loser Avatar */}
            <div className="flex items-center gap-4">
              <Image
                src={loser.avatar}
                alt={`${loser.name} Avatar`}
                height={64}
                width={64}
                loading="lazy"
                className="w-10 h-10 rounded-full border border-gray-400"
              />
              <div>
                <p className="font-bold text-gray-800">{loser.name} (Looser)</p>
                <p className="text-sm text-gray-600 text-left">Score: {loser.score}</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-400">#2</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 items-center text-center gap-2 mt-12 mb-8 mx-3">
          <button
            onClick={onRestart}
            className="col-span-1 px-4 py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-500 transition"
          >
            Restart
          </button>
          <button
            onClick={onHome}
            className="col-span-1 px-4 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-500 transition"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerLoserModal;
