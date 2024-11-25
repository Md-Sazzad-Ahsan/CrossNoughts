import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Game from "@/models/Game";

// Ensure database connection
await dbConnect();

export async function POST(req) {
  try {
    const data = await req.json();

    // Validate required fields
    const { roomCode, gameRound, hostSymbol, firstTurn, difficulty, status, playerOne, playerTwo } = data;
    if (!roomCode || !gameRound || !hostSymbol || !firstTurn || !status || !playerOne || !playerTwo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a new game document
    const newGame = new Game({
      roomCode,
      gameRound,
      hostSymbol,
      firstTurn,
      difficulty,
      status,
      playerOne,
      playerTwo,
    });

    // Save to database
    await newGame.save();

    return NextResponse.json({ message: "Game created successfully", game: newGame }, { status: 201 });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
