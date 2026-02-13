const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  electionStartDate: { type: Date, required: true },
  resultDate: { type: Date, required: true },
  isDeclared: { type: Boolean, default: false } // ⭐ Indha flag dhaan winner details-ai publish panna use aagum
});

module.exports = mongoose.model("Setting", schema);