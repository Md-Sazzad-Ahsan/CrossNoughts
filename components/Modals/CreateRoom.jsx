"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [gameRound, setGameRound] = useState("1 Round"); // Default to the first option
  const [turn, setTurn] = useState("I play first"); // Default to the first option
  const [symbol, setSymbol] = useState("X"); // Default to the first option

  const router = useRouter();

  const handleCreateRoom = () => {
    // Generate a random room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Navigate to the room page with query params
    router.push(
      `/room/${roomCode}?gameRound=${gameRound}&turn=${turn}&symbol=${symbol}`
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
              {["1 Round", "3 Round", "5 Round", "7 Round"].map((round) => (
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
