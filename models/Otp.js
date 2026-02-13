const mongoose = require("mongoose");

const schema = new mongoose.Schema({

 userId:{
  type:String,
  required:true
 },

 otp:{
  type:String,
  required:true
 },

 expiresAt:{
  type:Date,
  required:true,
  index:{ expires: 0 }   // ⭐ Auto delete after expiry
 },

 verified:{
  type:Boolean,
  default:false
 }

},{ timestamps:true });

module.exports = mongoose.model("Otp",schema);
