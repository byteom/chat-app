import mongoose from "mongoose"
import User from "./User.js"

const friendRequestSchema= new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true,
    },
     status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
