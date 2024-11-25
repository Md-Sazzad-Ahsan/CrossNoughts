import mongoose from "mongoose";
const { Schema } = mongoose;

const playerSchema = new Schema(
  {
    name: {
      type: String,  
      required: true,
    },
    username: {
      type: String,  
      required: true,
      unique: true
    },
    symbol: {
      type: String,  
      required: true, 
    },
    isHost: {
      type: Boolean, 
    }
  },
  { timestamps: true }
);

const gameSchema = new Schema(
    {
      roomCode: {
        type: String,  
        required: true,
        unique: true,
      },
      gameRound: {
        type: Number, // Changed to a number for easier handling (e.g., 3, 5, 7)
        required: true,
      },
      hostSymbol: {
        type: String,
        enum: ['X', 'O'],
        required: true, 
      },
      firstTurn: {
        type: String,
        enum: ['playerOne', 'playerTwo', 'computer'],
        required: true,
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'], // Example difficulties
        required: false, // Optional for human-only games
      },
      status: {
        type: String,
        enum: ['waiting', 'ongoing', 'completed'],
        required: true, 
      },
      boardState: {
        type: [[String]], // 2D array for game board state
        default: null, // Null means not started
      },
      playerOne: { type: playerSchema },
      playerTwo: { type: playerSchema },
    },
    { timestamps: true }
  );  

export default mongoose.models.Game || mongoose.model("Game", gameSchema);