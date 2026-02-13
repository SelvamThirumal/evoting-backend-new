const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Candidate", 
    required: true 
  },
  position: { 
    type: String, 
    required: true // "Chairman" or "Rep"
  }
}, { timestamps: true });

// IDHU DHAAN LOCK: 
// Oru studentId + Oru position combination unique-ah irukanum.
schema.index({ studentId: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("Vote", schema);