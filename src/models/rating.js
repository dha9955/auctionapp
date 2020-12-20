const mongoose = require("mongoose");
const ratingschema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    star: {
        type: Number,
        default: 0,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingschema);
