"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref, get, update } from "firebase/database";
import { getDatabase } from "@/app/firebaseConfig";
import { useParams } from "next/navigation";

export default function PlayRoomPage() {
  const router = useRouter();
  const params = useParams();
  const [roomCode, setRoomCode] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure roomCode is properly set
    if (params?.roomCode) {
      setRoomCode(params.roomCode);
    } else {
      // setError("Initializing Room Code.");
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    const initializeAndJoinRoom = async () => {
      if (!roomCode) return;

      try {
        // Generate or retrieve the player ID
        let playerId = localStorage.getItem("playerId");
        if (!playerId) {
          playerId = Math.random().toString(36).substring(2, 15);
          localStorage.setItem("playerId", playerId);
        }

        // Initialize Firebase Database
        const db = getDatabase();
        const roomRef = ref(db, `rooms/${roomCode}`);
        const snapshot = await get(roomRef);

        if (!snapshot.exists()) {
          setError("Room not found.");
          setLoading(false);
          return;
        }

        const roomData = snapshot.val();
        if (roomData.status !== "waiting") {
          setError("This room is not available.");
          setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };

    initializeAndJoinRoom();
  }, [roomCode, router]);

  if (loading) return <p className="text-center text-gray-800 mt-32 md:mt-24">Initializing...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return <p className="text-center text-gray-800 mt-32 md:mt-24">Joining room {roomCode}...</p>;
}
