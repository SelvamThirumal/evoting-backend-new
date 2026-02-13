const router = require("express").Router(); // <--- Intha line dhaan unga file-la line 1-ah irukanum
const User = require("../models/User"); 
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/voteController");

// Cast Vote
router.post("/", auth, ctrl.vote);

// Get Status - Inga dhaan 'Already Voted' logic irukku
router.get("/status", auth, async (req, res) => {
  try {
    // Current user-ai DB-la thedurom
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // User document-la irukra array-ai edukkurom
    const positions = user.votedPositions || [];

    res.json({
      // 2 posts (Chairman & Rep) mudichutta true-nu anupuvom
      voted: positions.length >= 2, 
      votedPositions: positions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; // File oda end-la idhu kandippa irukanum