import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Game from "@/models/Game";

export async function GET(req, { params }) {
  const { roomCode } = params;

  try {
    // Connect to the database
    await dbConnect();

    // Find the room by roomCode
    const room = await Game.findOne({ roomCode });

    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { roomCode } = params;

  try {
    const updates = await req.json();

    // Connect to the database
    await dbConnect();

    // Find and update the room by roomCode
    const updatedRoom = await Game.findOneAndUpdate({ roomCode }, updates, { new: true });

    if (!updatedRoom) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedRoom });
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { roomCode } = params;

  try {
    // Connect to the database
    await dbConnect();

    // Find and delete the room by roomCode
    const deletedRoom = await Game.findOneAndDelete({ roomCode });

    if (!deletedRoom) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedRoom });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
