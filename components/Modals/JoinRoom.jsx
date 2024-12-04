"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(null); // For error handling
  const router = useRouter();

  const handleJoinRoom = async () => {
    try {
      // Fetch room details from the backend
      const response = await fetch(`/api/room/${roomCode}`, {
        method: "GET",
      });

      const result = await response.json();

      if (!result.success) {
        setError("Room not found. Please check the code and try again.");
        return;
      }

      const { gameRound, firstTurn, hostSymbol } = result.data;

      // Adjust values for the joining player
      const turn = firstTurn === "host" ? "opponent" : "host";
      const symbol = hostSymbol === "X" ? "O" : "X";

      // Redirect to the game room with query params
      router.push(
        `/room/${roomCode}?gameRound=${gameRound}&turn=${turn}&symbol=${symbol}`
      );
    } catch (err) {
      console.error("Error joining room:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl sm:mx-auto mt-8 px-3 py-5">
      <section className="bg-white md:shadow-sm md:px-10 py-10 md:border border-gray-200 rounded-md">
        <h1 className="text-4xl text-center pb-12 font-extrabold text-gray-800">
          CrossNoughts
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoinRoom();
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="roomCode"
              className="block text-sm font-medium text-gray-700"
            >
              Room Code
            </label>
            <input
              id="roomCode"
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
                setError(null); // Clear error on input change
              }}
              className="mt-5 mx-auto w-full px-5 py-2 text-center text-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Submit Button */}
          <div className="text-center mt-2">
            <button
              type="submit"
              className="inline-flex justify-center items-center w-full px-10 py-3 text-white font-medium bg-gray-800 hover:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Join Room
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
