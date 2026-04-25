import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String }, // null for Google OAuth users
    avatar:   { type: String, default: "" },
    bio:      { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
