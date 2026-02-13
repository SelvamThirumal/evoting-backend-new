const CandidatePhoto = require("../models/CandidatePhoto");

// ================= UPLOAD PHOTO =================
exports.uploadPhoto = async(req,res)=>{
  try{

    if(!req.file)
      return res.status(400).json("No file received");

    const img = req.file.buffer.toString("base64");

    const saved = await CandidatePhoto.findOneAndUpdate(
      { candidateId:req.params.id },
      { image:`data:${req.file.mimetype};base64,${img}` },
      { upsert:true, new:true }
    );

    res.json(saved);

  }catch(err){
    res.status(500).json(err.message);
  }
};


// ================= GET PHOTO =================
exports.getPhoto = async(req,res)=>{
  try{

    const photo = await CandidatePhoto.findOne({
      candidateId:req.params.id
    });

    res.json(photo);

  }catch(err){
    res.status(500).json(err.message);
  }
};
