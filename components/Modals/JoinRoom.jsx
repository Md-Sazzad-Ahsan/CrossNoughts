"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDatabase, ref, get, update } from "firebase/database"; // Firebase functions

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(null); // For error handling
  const [playerId, setPlayerId] = useState(null); // Unique player identifier
  const router = useRouter();

  // Generate or retrieve the player ID
  useEffect(() => {
    let storedPlayerId = localStorage.getItem("playerId");
    if (!storedPlayerId) {
      storedPlayerId = generatePlayerId(); // Generate a new ID
      localStorage.setItem("playerId", storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

  // Generate a unique player ID
  const generatePlayerId = () => Math.random().toString(36).substring(2, 15);

  const handleJoinRoom = async () => {
    try {
      const db = getDatabase(); // Initialize Firebase Database
      const roomRef = ref(db, `rooms/${roomCode}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        setError("Room not found. Please check the code and try again.");
        return;
      }

      const roomData = snapshot.val();

      if (roomData.status !== "waiting") {
        setError("This room is no longer available or the game has already started.");
        return;
      }

      // Update the room with the player's ID
      await update(roomRef, {
        playerTwoId: playerId,
        status: "ongoing", // Change status to "ongoing" after the opponent joins
      });

      // Redirect to the game room with the playerId
      router.push(`/room/${roomCode}?playerTwoId=${playerId}`);
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
