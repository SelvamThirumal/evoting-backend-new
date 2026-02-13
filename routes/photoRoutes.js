const router = require("express").Router();
const multer = require("multer");
const upload = multer();

const ctrl = require("../controllers/photoController");
const auth = require("../middleware/authMiddleware");

// Upload photo
router.post("/upload/:id", auth, upload.single("file"), ctrl.uploadPhoto);

// Get photo by candidate id
router.get("/:id", auth, ctrl.getPhoto);

// ⭐ ADD THIS — get all photos (for dashboard list)
router.get("/", auth, async (req,res)=>{
  const CandidatePhoto = require("../models/CandidatePhoto");
  const list = await CandidatePhoto.find();
  res.json(list);
});

module.exports = router;
