const Vote = require("../models/Vote");
const User = require("../models/User");

exports.vote = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.votedPositions.includes(req.body.position)) {
      return res.status(400).json("Already voted");
    }

    await Vote.create({
      studentId: req.user.id,
      candidateId: req.body.candidateId,
      position: req.body.position
    });

    user.votedPositions.push(req.body.position);
    await user.save();

    res.json("Vote saved");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};