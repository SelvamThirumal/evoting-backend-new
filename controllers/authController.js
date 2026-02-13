const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req,res)=>{
 try{
  const { name,email,password,phone,role,department,regNo } = req.body;

  const existing = await User.findOne({email});
  if(existing) return res.status(400).json("Email exists");

  const hash = await bcrypt.hash(password,10);

  const userData = {
    name,
    email,
    password:hash,
    role,
    votedPositions:[]
  };

  if(role==="student"){
    userData.phone = phone;
    userData.department = department;
    userData.regNo = regNo;
  }

  const user = await User.create(userData);
  res.json(user);

 }catch(err){
  console.log(err);
  res.status(500).json(err.message);
 }
};


exports.login = async (req,res)=>{
 try{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.status(400).json("User not found");

  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.status(400).json("Wrong password");

  const token = jwt.sign(
    {id:user._id,role:user.role},
    process.env.JWT_SECRET
  );

  res.json({token,user});

 }catch(err){
  res.status(500).json(err.message);
 }
};
