const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
 try{

   const header = req.headers.authorization;

   if(!header)
     return res.status(401).json("No token");

   const token = header.split(" ")[1];

   // ⭐ USE ENV SECRET
   const data = jwt.verify(token, process.env.JWT_SECRET);

   req.user = data;

   next();

 }catch(err){
   console.log("TOKEN ERROR:", err.message);
   res.status(401).json("Invalid token");
 }
};
