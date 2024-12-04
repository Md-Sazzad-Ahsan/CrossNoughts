import mongoose from "mongoose";
const { Schema } = mongoose;

const gameSchema = new Schema(
    {
      roomCode: {
        type: String,  
        required: true,
        unique: true,
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
    },
    { timestamps: true }
  );  
  
  export default mongoose.models.Game || mongoose.model("Game", gameSchema);
  // boardState: {
  //   type: [[String]], // 2D array for game board state
  //   default: null, 
  // },
  // playerOne: { type: playerSchema },
  // playerTwo: { type: playerSchema },