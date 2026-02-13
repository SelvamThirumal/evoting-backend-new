const Candidate = require("../models/Candidate");
const QRCode = require("qrcode");


// ================= CREATE =================
exports.createCandidate = async (req, res) => {
  try {

    const text = req.body.name + " - " + req.body.position;
    const qr = await QRCode.toDataURL(text);

    const c = await Candidate.create({
      ...req.body,
      qrCode: qr,
      approved: false
    });

    res.status(201).json(c);

  } catch (err) {
    res.status(400).json(err.message);
  }
};



// ================= GET APPROVED =================
exports.getApproved = async (req, res) => {
  try {

    const list = await Candidate.find({ approved: true });
    res.json(list);

  } catch (err) {
    res.status(500).json(err.message);
  }
};



// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {

    const list = await Candidate.find();
    res.json(list);

  } catch (err) {
    res.status(500).json(err.message);
  }
};



// ================= APPROVE =================
exports.approveCandidate = async (req, res) => {
  try {

    const c = await Candidate.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    res.json(c);

  } catch (err) {
    res.status(500).json(err.message);
  }
};



// ================= REJECT =================
exports.rejectCandidate = async (req, res) => {
  try {

    const c = await Candidate.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );

    res.json(c);

  } catch (err) {
    res.status(500).json(err.message);
  }
};



// ================= SYMBOL =================
exports.assignSymbol = async (req, res) => {
  try {

    const c = await Candidate.findByIdAndUpdate(
      req.params.id,
      { symbol: req.body.symbol },
      { new: true }
    );

    res.json(c);

  } catch (err) {
    res.status(500).json(err.message);
  }
};
