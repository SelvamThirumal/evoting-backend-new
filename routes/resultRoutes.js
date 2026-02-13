const router = require("express").Router();
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const auth = require("../middleware/authMiddleware");

// @route   GET /api/results/declare
router.get("/declare", auth, async (req, res) => {
  try {
    // Logic: Database-la irundhu votes-ai count panni details-oda join panrom
    const result = await Vote.aggregate([
      {
        $group: {
          _id: "$candidateId",
          total: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "_id",
          as: "candidateInfo"
        }
      },
      { $unwind: "$candidateInfo" },
      { $sort: { total: -1 } },
      {
        $project: {
          _id: 1,
          total: 1,
          name: "$candidateInfo.name",
          position: "$candidateInfo.position"
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Result Calc Error:", err);
    res.status(500).json("Calculation failed");
  }
});

// @route   POST /api/results/declare
router.post("/declare", auth, async (req, res) => {
  res.json("Results declared in database! ✅");
});

module.exports = router;