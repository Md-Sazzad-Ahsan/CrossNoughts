import React from "react";
import PropTypes from "prop-types";

const Waiting = ({
  playerOneId,
  playerTwoId,
  playerOneSym,
  playerTwoSym,
  roomCode,
  onStart, // Callback to start the game
}) => {
  // Determine readiness based on the presence of both players
  const isReadyToStart = playerOneId && playerTwoId;

  const handleStart = () => {
    if (isReadyToStart) {
      onStart(); // Ensure this is being called
    } else {
      console.log("Game not ready to start."); 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 md:max-w-xl mx-auto rounded-lg p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-4">CrossNoughts</h2>
        <div className="space-y-4">
          {/* Player 1 Info */}
          <div className="flex items-center justify-between border border-gray-300 rounded-lg py-2 px-5">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600">👤</span>
              </div>
              <span className="text-lg font-medium">{playerOneId || "Player 1"}</span>
            </div>
            <span className="text-xl font-bold">{playerOneSym}</span>
          </div>

          {/* Player 2 Info */}
          <div className="flex items-center justify-between border border-gray-300 rounded-lg py-2 px-5">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600">👤</span>
              </div>
              <span className="text-lg font-medium">
                {playerTwoId || "Waiting for Player 2..."}
              </span>
            </div>
            <span className="text-xl font-bold">{playerTwoSym}</span>
          </div>

          {/* Room Code Display */}
          <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Room Code: {roomCode}</span>
          </div>

          {/* Invite Button */}
          <div className="flex space-x-4">
            <button
              className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 font-medium hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(roomCode);
                alert("Room Code copied to clipboard!");
              }}
            >
              INVITE
            </button>
          </div>

          {/* Start Button */}
          <button
            className={`w-full py-2 rounded-lg font-medium text-white ${
              isReadyToStart
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleStart}
            disabled={!isReadyToStart}
          >
            {isReadyToStart ? "Start Game" : "Waiting for Players"}
          </button>
        </div>
      </div>
    </div>
  );
};

// // Prop validation
// Waiting.propTypes = {
//   playerOneId: PropTypes.string,
//   playerTwoId: PropTypes.string,
//   playerOneSym: PropTypes.string.isRequired,
//   playerTwoSym: PropTypes.string.isRequired,
//   roomCode: PropTypes.string.isRequired,
//   onStart: PropTypes.func.isRequired,
// };

export default Waiting;
