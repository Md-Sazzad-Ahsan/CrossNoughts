// /app/api/game/[roomCode]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Game from "@/models/Game";

// Ensure database connection
await dbConnect();

export async function GET(req, { params }) {
  try {
    const { roomCode } = params;

    // Find the game by roomCode
    const game = await Game.findOne({ roomCode });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ game }, { status: 200 });
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { roomCode } = params;
    const data = await req.json();

    // Update the game
    const updatedGame = await Game.findOneAndUpdate({ roomCode }, data, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Game updated successfully", game: updatedGame }, { status: 200 });
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
