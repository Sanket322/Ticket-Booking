const mongoose = require("mongoose");

const ScreenSchema = new mongoose.Schema(
  {
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    seatLayout: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {}
    },
    totalSeats: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Screen", ScreenSchema);