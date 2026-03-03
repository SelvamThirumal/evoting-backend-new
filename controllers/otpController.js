const Otp = require("../models/Otp");
const twilio = require("twilio");

let client = null;

if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
  client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
}

// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  try {

    console.log("==== OTP API HIT ====");

    if (!req.user) {
      console.log("❌ req.user undefined");
      return res.status(401).json("Unauthorized");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ userId: req.user.id });

    await Otp.create({
      userId: req.user.id,
      otp,
      expiresAt: new Date(Date.now() + 300000),
      verified: false
    });

    let userPhone = req.user.phone || "9047150641";
    const toPhone = userPhone.startsWith("+")
      ? userPhone
      : `+91${userPhone}`;

    console.log("\n----------------------------");
    console.log("📲 USER ID:", req.user.id);
    console.log("📞 PHONE:", toPhone);
    console.log("🔐 OTP:", otp);
    console.log("----------------------------\n");

    if (client && process.env.TWILIO_PHONE) {
      try {
        await client.messages.create({
          body: `Your E-Voting OTP is ${otp}.`,
          from: process.env.TWILIO_PHONE,
          to: toPhone
        });

        return res.json("OTP sent to mobile ✅");
      } catch (twilioErr) {
        console.log("⚠️ Twilio error:", twilioErr.message);
        return res.json("OTP generated (Check Console 💻)");
      }
    }

    return res.json("OTP generated (Console Mode 💻)");

  } catch (err) {
    console.error("General Error:", err.message);
    res.status(500).json("Server Error");
  }
};


// ================= VERIFY OTP =================
const verifyOtp = async (req, res) => {
  try {

    const { otp } = req.body;

    const rec = await Otp.findOne({
      userId: req.user.id,
      otp
    });

    if (!rec) return res.status(400).json("Invalid OTP ❌");
    if (rec.expiresAt < Date.now()) return res.status(400).json("OTP expired ⏰");
    if (rec.verified) return res.status(400).json("OTP already used ⚠️");

    rec.verified = true;
    await rec.save();

    res.json("OTP Verified ✅");

  } catch (err) {
    res.status(500).json("Verification failed ❌");
  }
};


module.exports = { sendOtp, verifyOtp };