import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileno:{
      type: String,
      required: true,
    },
    date:{
     type: Date,
     required:true,
    },
    password: {
      required: true,
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export const User = mongoose.model("User", schema);