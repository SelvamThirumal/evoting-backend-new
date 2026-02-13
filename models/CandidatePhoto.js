const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  candidateId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Candidate"
  },
  image:String
},{timestamps:true});

module.exports = mongoose.model("CandidatePhoto",schema);
