const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// STATIC (optional preview)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/votes", require("./routes/voteRoutes"));
app.use("/api/settings", require("./routes/settingRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));


// ⭐ THIS LINE WAS MISSING IN MANY SETUPS
app.use("/api/photos", require("./routes/photoRoutes"));


// ================= HEALTH =================
app.get("/", (req,res)=>{
  res.send("E-Voting Backend Running 🚀");
});


// ================= ERROR =================
app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json("Server crash");
});


// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("MongoDB Connected ✅");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT,()=>{
    console.log("Server running 🔥", PORT);
  });

})
.catch(err=>console.log(err));
