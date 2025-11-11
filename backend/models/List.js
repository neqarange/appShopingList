import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    archived: { type: Boolean, default: false },
  },

  { timestamps: true }
);

export default mongoose.model("List", listSchema);
