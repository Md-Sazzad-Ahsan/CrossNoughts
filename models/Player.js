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

export default mongoose.models.Player || mongoose.model("Player", gameSchema);