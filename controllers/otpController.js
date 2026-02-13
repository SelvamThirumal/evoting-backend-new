const Otp = require("../models/Otp");
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

exports.sendOtp = async (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ userId: req.user.id });

    await Otp.create({
      userId: req.user.id,
      otp,
      expiresAt: new Date(Date.now() + 300000), 
      verified: false
    });

    let userPhone = req.user.phone || "9047150641"; 
    const toPhone = userPhone.startsWith('+') ? userPhone : `+91${userPhone}`;

    // ⭐ Test Mode logic: 
    // Terminal-la OTP-ai print panrom (SMS varaatiyum idhai paathu type pannalaam)
    console.log(`\n--- 🔐 DEVELOPMENT OTP ---`);
    console.log(`FOR: ${toPhone}`);
    console.log(`OTP: ${otp}`);
    console.log(`--------------------------\n`);

    try {
      // Twilio SMS Request
      await client.messages.create({
        body: `Your E-Voting OTP is ${otp}.`,
        from: process.env.TWILIO_PHONE,
        to: toPhone
      });
      res.json("OTP sent to mobile! ✅");
    } catch (twilioErr) {
      console.error("⚠️ Twilio Failed, but OTP saved in DB:", twilioErr.message);
      // Backend error vandhaalum, user-ku positive response anupuvom (Mock mode)
      res.json("OTP sent (Check Backend Terminal for Demo) 💻");
    }

  } catch (err) {
    console.error("General Error:", err.message);
    res.status(500).json("Server Error: " + err.message);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const rec = await Otp.findOne({ userId: req.user.id, otp });

    if (!rec) return res.status(400).json("Invalid OTP ❌");
    if (rec.expiresAt < Date.now()) return res.status(400).json("OTP expired ⏰");
    if (rec.verified) return res.status(400).json("OTP already used ⚠️");

    rec.verified = true;
    await rec.save();
    res.json("Verified");
  } catch (err) {
    res.status(500).json("Verification failed ❌");
  }
};