import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema(
  {
    title:      { type: String, required: true },
    prompt:     { type: String, required: true },
    tool:       { type: String, required: true, enum: ["DekNek3D", "Meshy", "Tripo", "Spline", "Other"] },
    category:   { type: String, required: true },
    tags:       { type: [String], default: [] },
    image:      { type: String, required: true },
    author:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    upvotes:    { type: Number, default: 0 },
    upvotedBy:  { type: [Schema.Types.ObjectId], ref: "User", default: [] }, // prevents double upvoting
  },
  { timestamps: true }
);

export const Post = models.Post || mongoose.model("Post", PostSchema);
