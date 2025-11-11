import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    bought: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },

  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
