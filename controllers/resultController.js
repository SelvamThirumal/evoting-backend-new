const Vote = require("../models/Vote");

exports.getResult = async (req, res) => {
  try {
    const results = await Vote.aggregate([
      // 1. Group by candidateId and count votes
      {
        $group: {
          _id: "$candidateId",
          totalVotes: { $sum: 1 }
        }
      },
      // 2. Join with Candidates collection to get name/photo
      {
        $lookup: {
          from: "candidates",      // Unnoda candidate collection name (usually plural)
          localField: "_id",
          foreignField: "_id",
          as: "candidateInfo"
        }
      },
      // 3. Flatten the array from lookup
      { $unwind: "$candidateInfo" },
      // 4. Sort by highest votes
      { $sort: { totalVotes: -1 } },
      // 5. Project only needed fields
      {
        $project: {
          _id: 1,
          totalVotes: 1,
          name: "$candidateInfo.name",
          party: "$candidateInfo.party",
          photo: "$candidateInfo.photo"
        }
      }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};