const Setting = require("../models/Setting");

// ⭐ HOD & Principal Dates-ai save panna
exports.setDates = async(req, res) => {
  try {
    let s = await Setting.findOne();

    if (!s) {
      // ⚠️ Required error varaama irukka defaults set panrom
      s = await Setting.create({
        electionStartDate: req.body.electionStartDate || new Date(),
        resultDate: req.body.resultDate || new Date(),
        isDeclared: false
      });
    } else {
      if(req.body.electionStartDate) s.electionStartDate = req.body.electionStartDate;
      if(req.body.resultDate) s.resultDate = req.body.resultDate;
      await s.save();
    }
    res.json("Dates updated in database! ✅");
  } catch (err) {
    console.error("SetDates Error:", err.message); // VS Code terminal check pannunga
    res.status(500).json("Error updating dates: " + err.message);
  }
};

// ⭐ Results-ai official-aa declare panna
exports.declareResult = async(req, res) => {
  try {
    let s = await Setting.findOne();
    
    if (!s) {
      // Oru vaela dates-ae set pannala naalum, declare pannumbothu default-aa create pannidalaam
      s = await Setting.create({
        electionStartDate: new Date(),
        resultDate: new Date(),
        isDeclared: true
      });
    } else {
      s.isDeclared = true; 
      await s.save();
    }
    res.json("Results officially declared! 🏆");
  } catch (err) {
    console.error("Declare Error:", err.message);
    res.status(500).json("Declaration failed: " + err.message);
  }
};

// ⭐ Dates & Status-ai fetch panna
exports.getDates = async(req, res) => {
  try {
    const s = await Setting.findOne();
    // Default object logic stays same to prevent frontend crash
    res.json(s || { electionStartDate: null, resultDate: null, isDeclared: false });
  } catch (err) {
    res.status(500).json("Error fetching settings");
  }
};