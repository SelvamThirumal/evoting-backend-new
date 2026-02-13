const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  department: String,
  position: String,
  qrCode: String,
  symbol: String,

  approved: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Candidate", schema);
