const router = require("express").Router();
const ctrl = require("../controllers/settingController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ================= GET DATES =================
// Role middleware eduthudalam, logged in users ellarum paakalam
router.get("/dates", auth, async(req, res) => {
  try {
    await ctrl.getDates(req, res);
  } catch(err) {
    res.status(500).json(err.message);
  }
});

// ================= SET DATES =================
// ⭐ FIX: role("hod", "principal") nu comma pottu kudukanum, [] kulla poda koodadhu
router.put("/dates", auth, role("hod", "principal"), async(req, res) => {
  try {
    await ctrl.setDates(req, res);
  } catch(err) {
    res.status(500).json(err.message);
  }
});

// ================= DECLARE RESULTS =================
router.post("/declare-result", auth, role("principal"), async(req, res) => {
  try {
    await ctrl.declareResult(req, res);
  } catch(err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;