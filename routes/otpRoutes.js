const express = require("express");
const router = express.Router();

// ✅ Use destructuring (VERY IMPORTANT)
const { sendOtp, verifyOtp } = require("../controllers/otpController");

const auth = require("../middleware/authMiddleware");

// Debug check
console.log("sendOtp type:", typeof sendOtp);
console.log("verifyOtp type:", typeof verifyOtp);
console.log("auth type:", typeof auth);

router.post("/send", auth, sendOtp);
router.post("/verify", auth, verifyOtp);

module.exports = router;