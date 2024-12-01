"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [gameRound, setGameRound] = useState("");
  const [turn, setTurn] = useState("");
  const [symbol, setSymbol] = useState("");

  const router = useRouter();

  // Utility functions for randomness
  const getRandomGameRound = () => {
    const rounds = ["3 Round", "5 Round", "7 Round"];
    return rounds[Math.floor(Math.random() * rounds.length)];
  };

  const getRandomTurn = () => {
    const options = ["I play first", "Opponent first"];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getRandomSymbol = () => {
    const symbols = ["X", "O"];
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const handleCreateRoom = () => {
    // Generate a random room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Apply randomization if needed
    const selectedGameRound = gameRound || getRandomGameRound();
    const selectedTurn = turn || getRandomTurn();
    const selectedSymbol = symbol || getRandomSymbol();

    // Navigate to the room page with query params
    router.push(
      `/room/${roomCode}?gameRound=${selectedGameRound}&turn=${selectedTurn}&symbol=${selectedSymbol}`
    );
  };

  return (
    <div className="max-w-3xl sm:mx-auto mt-5 md:mt-20 p-5">
      <section className="bg-white md:shadow-sm md:px-5 py-10 md:py-5 md:border border-gray-200 rounded-md">
        <h1 className="text-4xl text-center pb-8 md:py-8 font-extrabold text-gray-800">
          CrossNoughts
        </h1>
        <form className="space-y-6">

          {/* Rounds */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Game Over after
            </label>
            <div className="mt-1 grid grid-cols-4 space-x-2 text-center">
              {["3 Round", "5 Round", "7 Round"].map((round) => (
                <button
                  key={round}
                  type="button"
                  onClick={() => setGameRound(round)}
                  className={`col-span-1 py-3 text-xs md:text-sm font-medium text-center rounded-md shadow-sm ${
                    gameRound === round
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {round}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setGameRound(getRandomGameRound())}
                className={`col-span-1 px-2 py-3 text-xs md:text-sm font-medium rounded-md shadow-sm ${
                  gameRound === ""
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {/* First Turn */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">
              First Move
            </label>
            <div className="mt-1 flex justify-start text-center space-x-2">
              {["I play first", "Opponent first"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTurn(option)}
                  className={`flex-grow px-2 py-3 text-xs md:text-sm font-medium text-center rounded-md shadow-sm ${
                    turn === option
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTurn(getRandomTurn())}
                className={`px-4 py-3 text-xs md:text-sm font-medium text-center rounded-md shadow-sm ${
                  turn === ""
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {/* Symbol Selection */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">
              Your Symbol
            </label>
            <div className="mt-1 flex space-x-2">
              {["X", "O"].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setSymbol(sym)}
                  className={`flex-grow px-4 py-3 text-xs md:text-sm font-medium text-center rounded-md shadow-sm ${
                    symbol === sym
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {sym}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSymbol(getRandomSymbol())}
                className={`px-4 py-3 text-xs md:text-sm font-medium text-center rounded-md shadow-sm ${
                  symbol === ""
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Random
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={handleCreateRoom}
              className="inline-flex justify-center items-center w-full px-10 py-3 mt-4 text-white font-medium bg-gray-800 hover:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create Room
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
