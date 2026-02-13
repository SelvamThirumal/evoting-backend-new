const router = require("express").Router();
const ctrl = require("../controllers/candidateController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const Candidate = require("../models/Candidate");
const CandidatePhoto = require("../models/CandidatePhoto");


// =====================================================
// 🟢 TEACHER — CREATE CANDIDATE
// =====================================================
router.post(
  "/",
  auth,
  role("teacher"),
  ctrl.createCandidate
);


// =====================================================
// 🟢 STUDENT — APPROVED + PHOTO MERGE
// =====================================================
router.get(
  "/approved",
  auth,
  async (req,res)=>{
    try{

      const candidates = await Candidate
        .find({ approved:true })
        .sort({ createdAt:-1 })
        .lean();

      const photos = await CandidatePhoto.find().lean();

      const photoMap = {};
      photos.forEach(p=>{
        photoMap[p.candidateId.toString()] = p.image;
      });

      const merged = candidates.map(c=>({
        ...c,
        image: photoMap[c._id.toString()] || null
      }));

      res.json(merged);

    }catch(err){
      console.error(err);
      res.status(500).json("Failed to fetch approved candidates");
    }
  }
);


// =====================================================
// 🟢 COMMON — GET ALL
// =====================================================
router.get(
  "/",
  auth,
  ctrl.getAll
);


// =====================================================
// 🟡 HOD — ASSIGN SYMBOL
// =====================================================
router.put(
  "/symbol/:id",
  auth,
  role("hod"),
  ctrl.assignSymbol
);


// =====================================================
// 🔵 PRINCIPAL — APPROVE
// =====================================================
router.put(
  "/approve/:id",
  auth,
  role("principal"),
  async (req,res)=>{
    try{

      const updated = await Candidate.findByIdAndUpdate(
        req.params.id,
        { approved:true },
        { new:true }
      );

      if(!updated)
        return res.status(404).json("Candidate not found");

      res.json(updated);

    }catch(err){
      console.error(err);
      res.status(500).json("Approval failed");
    }
  }
);


// =====================================================
// 🔵 PRINCIPAL — REJECT
// =====================================================
router.put(
  "/reject/:id",
  auth,
  role("principal"),
  async (req,res)=>{
    try{

      const updated = await Candidate.findByIdAndUpdate(
        req.params.id,
        { approved:false },
        { new:true }
      );

      if(!updated)
        return res.status(404).json("Candidate not found");

      res.json(updated);

    }catch(err){
      console.error(err);
      res.status(500).json("Reject failed");
    }
  }
);


// =====================================================
// 🔴 DELETE — PRINCIPAL + TEACHER ALLOWED
// =====================================================
router.delete(
  "/:id",
  auth,
  async (req,res)=>{
    try{

      // ⭐ ROLE CHECK (ALLOW BOTH)
      if(req.user.role !== "principal" && req.user.role !== "teacher"){
        return res.status(403).json("Access denied");
      }

      const deleted = await Candidate.findByIdAndDelete(req.params.id);

      if(!deleted)
        return res.status(404).json("Candidate not found");

      res.json({
        success:true,
        message:"Candidate Deleted Successfully 🗑️"
      });

    }catch(err){
      console.error(err);
      res.status(500).json("Delete failed");
    }
  }
);

module.exports = router;
