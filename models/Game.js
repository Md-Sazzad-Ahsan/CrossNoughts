import mongoose from "mongoose";
const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    isHost: {
      type: Boolean,
      required: true,
    },
    gameRound: {
      type: Number,
      required: true,
    },
    hostSymbol: {
      type: String,
      enum: ['X', 'O'],
      required: true,
    },
    opponentSymbol: {
      type: String,
      enum: ['X', 'O'],
      required: true,
    },
    firstTurn: {
      type: String,
      enum: ['host', 'opponent', 'computer'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: false,
    },
    status: {
      type: String,
      enum: ['waiting', 'ongoing', 'completed'],
      required: true,
    },
    board: {
      type: [String], 
      validate: {
        validator: (arr) => arr.length === 9 && arr.every((val) => val === "" || val === 'X' || val === 'O'),
        message: 'The board must have exactly 9 elements, each either null, "X", or "O".',
      },
      default: Array(9).fill(""), 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Game || mongoose.model("Game", gameSchema);
