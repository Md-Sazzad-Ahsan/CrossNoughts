import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
} from "next-share";

const Waiting = ({
  playerOneId,
  playerTwoId,
  playerOneSym,
  playerTwoSym,
  roomCode,
  onStart, // Callback to start the game
}) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine readiness based on the presence of both players
  const isReadyToStart = playerOneId && playerTwoId;

  const handleStart = () => {
    if (isReadyToStart) {
      onStart(); // Ensure this is being called
    } else {
      console.log("Game not ready to start.");
    }
  };

  // Room URL for sharing
  const roomUrl = `https://crossnought.vercel.app/play/${roomCode}`;
  const roomTitle = "Join my CrossNoughts game room!";
  const messengerUrl = `https://m.me/?text=Join%20my%20CrossNoughts%20game!%20${encodeURIComponent(roomUrl)}`;

  const handleMessengerShare = () => {
    // Open Messenger in a new window
    window.open(messengerUrl, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomUrl);
    alert("Room URL copied to clipboard!");
  };

  // Initialize Facebook SDK
  useEffect(() => {
    // Load the Facebook SDK for JavaScript
    if (typeof window !== "undefined") {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, // Replace with your app ID
          xfbml: true,
          version: "v15.0",
        });
      };

      // Load the SDK script asynchronously
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);

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
              <span className="text-lg font-medium">{playerOneId || "Host"}</span>
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
            <span className="text-gray-500 text-md">Room Code: {roomCode}</span>
          </div>

          {/* Invite Button */}
          <div className="flex space-x-2 text-center">
            <Link
              href="/"
              className="flex-1 border border-gray-300 rounded-lg py-3 w-1/2 text-gray-600 hover:text-gray-50 font-medium bg-gray-300 hover:bg-gray-600"
            >
              Home
            </Link>
            <button
              className="flex-1 border border-gray-300 rounded-lg py-3 w-1/2 text-gray-50 bg-gray-500 hover:bg-gray-600 font-medium"
              onClick={() => setIsModalOpen(true)} // Open Modal
            >
              INVITE
            </button>
          </div>

          {/* Start Button */}
          <button
            className={`w-full py-3 rounded-lg font-medium text-white ${
              isReadyToStart
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={handleStart}
            disabled={!isReadyToStart}
          >
            {isReadyToStart ? "Start Game" : "Waiting for Opponent"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:max-w-lg mx-auto p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Share Room</h2>
            <p className="text-gray-600 mb-6 text-center">
              Copy and send this link to invite:
            </p>
            {/* Flexbox for alignment and wrapping */}
            <div className="flex items-center sm:justify-between border border-dashed border-gray-300 rounded-lg">
              <p className="flex bg-gray-100 text-gray-800 rounded-md p-2 text-center sm:text-left">
                {roomUrl}
              </p>
              <button
                onClick={handleCopyLink}
                className=" sm:ml-4 bg-blue-500 text-white text-xs px-2 py-3 rounded-lg"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-around mb-4 mt-4">
              <FacebookShareButton url={roomUrl} quote={roomTitle}>
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Facebook
                </div>
              </FacebookShareButton>
              <WhatsappShareButton url={roomUrl} title={roomTitle}>
                <div className="px-4 py-2 bg-green-500 text-white rounded-lg">
                  WhatsApp
                </div>
              </WhatsappShareButton>
              <TwitterShareButton url={roomUrl} title={roomTitle}>
                <div className="px-4 py-2 bg-blue-400 text-white rounded-lg">
                  Twitter
                </div>
              </TwitterShareButton>
            </div>
            <div className="flex justify-around mb-4">
              <EmailShareButton subject={roomTitle} body={roomUrl}>
                <div className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                  Email
                </div>
              </EmailShareButton>
              <button
                className="w-1/2 py-2 rounded-lg font-medium text-white bg-blue-800 hover:bg-blue-900"
                onClick={handleMessengerShare}
              >
                Messenger
              </button>
            </div>
            <button
              className="mt-6 w-full py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
              onClick={() => setIsModalOpen(false)} // Close Modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Waiting;
