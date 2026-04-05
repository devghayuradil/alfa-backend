import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Page", pageSchema);
