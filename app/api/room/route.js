import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Game from "@/models/Game";

export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const { roomCode, gameRound, turn, symbol, difficulty } = await req.json();

    // Map frontend values to the schema
    const hostSymbol = symbol;
    const gameMode = difficulty;
    const firstTurn = turn === "host" 
    ? "host" 
    : turn === "opponent" 
    ? "opponent" 
    : "computer";  
    const status = "waiting"; // Default status when room is created

    // Connect to the database
    await dbConnect();

    // Create a new game document
    const newGame = await Game.create({
      roomCode,
      gameRound: parseInt(gameRound), // Ensure it's a number
      hostSymbol,
      firstTurn,
      status,
      gameMode,
    });

    return NextResponse.json({ success: true, data: newGame });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
