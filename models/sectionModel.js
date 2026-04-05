import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
    },

    type: {
      type: String,
      enum: ["hero", "products", "collections", "banner", "text"],
      required: true,
    },

    content: {
      type: Object,
      default: {},
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Section", sectionSchema);
