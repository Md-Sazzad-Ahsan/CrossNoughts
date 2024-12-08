"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref, get, update } from "firebase/database";
import { getDatabase } from "@/app/firebaseConfig";
import { useParams } from "next/navigation";

export default function PlayRoomPage() {
  const router = useRouter();
  const { roomCode } = useParams();
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  // Generate or retrieve the player ID
  useEffect(() => {
    let storedPlayerId = localStorage.getItem("playerId");
    if (!storedPlayerId) {
      storedPlayerId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("playerId", storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

  useEffect(() => {
    const joinRoom = async () => {
      if (!playerId || !roomCode) {
        setError("Player ID or Room Code is missing.");
        return;
      }
  
      try {
        const db = getDatabase(); // Initialize Firebase Database
        const roomRef = ref(db, `rooms/${roomCode}`);
        const snapshot = await get(roomRef);
  
        if (!snapshot.exists()) {
          setError("Room not found.");
          return;
        }
  
        const roomData = snapshot.val();
        if (roomData.status !== "waiting") {
          setError("This room is not available.");
          return;
        }
  
        await update(roomRef, {
          playerTwoId: playerId,
          status: "ready",
        });
  
        console.log("Redirecting with:", { roomCode, playerId });
        router.push(`/room/${roomCode}?playerTwoId=${playerId}`);
      } catch (err) {
        console.error("Error joining room:", err);
        setError("An error occurred. Please try again.");
      }
    };
  
    joinRoom();
  }, [playerId, roomCode, router]);
  

  // Render errors or loading state
  if (!roomCode) return <p className="text-red-500 text-center">Room code is missing.</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return <p className="text-center text-gray-800">Joining room {roomCode}...</p>;
}
