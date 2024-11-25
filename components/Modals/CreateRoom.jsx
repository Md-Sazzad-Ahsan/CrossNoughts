"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [gameRound, setGameRound] = useState("");
  const [turn, setTurn] = useState("");
  const [symbol, setSymbol] = useState("");

  const router = useRouter();

  const handleCreateRoom = () => {
    // Generate a random room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const opponent = "player";
    // Navigate to the room page with query params
    router.push(
      `/room/${roomCode}?gameRound=${gameRound}&turn=${turn}&symbol=${symbol}&opponent=${opponent}`
    );
  };

  return (
    <div className="max-w-3xl sm:mx-auto mt-20 px-3 py-5">
      <section className="bg-white shadow-md px-5 md:px-10 py-10 border border-gray-200 rounded-md">
        <h1 className="text-4xl text-center pb-8 font-extrabold text-gray-800">
          CrossNoughts
        </h1>
        <form className="space-y-6">

          {/* Rounds */}
          <div>
            <label
              htmlFor="gameRound"
              className="block text-sm font-medium text-gray-700"
            >
              Round
            </label>
            <select
              id="gameRound"
              value={gameRound}
              onChange={(e) => setGameRound(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            >
              <option value="">Random</option>
              {["3 Round", "5 Round", "7 Round"].map((round) => (
                <option key={round} value={round}>
                  {round}
                </option>
              ))}
            </select>
          </div>

          {/* First Turn */}
          <div>
            <label
              htmlFor="turn"
              className="block text-sm font-medium text-gray-700"
            >
              First Turn
            </label>
            <select
              id="turn"
              value={turn}
              onChange={(e) => setTurn(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            >
              <option value="">Random</option>
              {["I play first", "Opponent First"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Symbol Selection */}
          <div>
            <label
              htmlFor="symbol"
              className="block text-sm font-medium text-gray-700"
            >
              Select Symbol
            </label>
            <select
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            >
              <option value="">Random</option>
              {["X", "O"].map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={handleCreateRoom}
              className="inline-flex justify-center items-center w-full md:w-auto px-10 py-2 text-white font-medium bg-gray-800 hover:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create Room
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
