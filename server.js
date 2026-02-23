const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();


// ================= CORS (PRODUCTION READY) =================
const allowedOrigins = [
  "http://localhost:5173",                     // local dev
  "https://evoting-frontend-henna.vercel.app"  // ⭐ your Vercel frontend
];

app.use(cors({
  origin: function (origin, callback) {

    // allow requests with no origin (Postman / mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked ❌"));
    }
  },
  credentials: true
}));


// ================= MIDDLEWARE =================
app.use(express.json());


// ================= STATIC (image preview) =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/votes", require("./routes/voteRoutes"));
app.use("/api/settings", require("./routes/settingRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/photos", require("./routes/photoRoutes"));


// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("E-Voting Backend Running 🚀");
});


// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json("Server crash");
});


// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("Server running 🔥", PORT);
    });

  })
  .catch(err => console.log(err));