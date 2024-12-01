"use client";
import React, { useState } from "react";

export default function CreateRoom() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="max-w-3xl sm:mx-auto mt-8 px-3 py-5">
      <section className="bg-white md:shadow-sm md:px-10 py-10 md:border border-gray-200 rounded-md">
        <h1 className="text-4xl text-center pb-12 font-extrabold text-gray-800">
          CrossNoughts
        </h1>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="roomCode"
              className="block text-sm font-medium text-gray-700"
            >
            </label>
            <input
              id="roomCode"
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="mt-5 mx-auto w-full px-5 py-2 text-center text-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center mt-2">
            <button
              type="button"
              className="inline-flex justify-center items-center w-full md:w-auto px-10 py-3 text-white font-medium bg-gray-800 hover:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Join Room
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
