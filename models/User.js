const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  // OPTIONAL — only for students
  phone:{
    type:String,
    required:false
  },

  role:{
    type:String,
    enum:["student","teacher","hod","principal"],
    required:true
  },

  department:String,

  regNo:String,

  votedPositions:[String]

},{timestamps:true});

module.exports = mongoose.model("User",schema);
