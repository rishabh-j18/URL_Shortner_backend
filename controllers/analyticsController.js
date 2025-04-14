/***Can be used for further research about the link clicked */

const Analytics = require("../models/Analytics");
const parseUserAgent = require("../utils/parseUserAgent");

const logVisit = async (req, linkId) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgentString = req.headers["user-agent"];
    const deviceDetails = parseUserAgent(userAgentString);

    const newEntry = new Analytics({
      linkId,
      ip,
      ...deviceDetails,
    });

    await newEntry.save();
  } catch (err) {
    console.error("Error logging analytics:", err);
  }
};

const getAnalyticsByUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const data = await Analytics.aggregate([
      {
        $lookup: {
          from: "links",
          localField: "linkId",
          foreignField: "_id",
          as: "link",
        },
      },
      { $unwind: "$link" },
      { $match: { "link.userId": require("mongoose").Types.ObjectId(userId) } },
      {
        $project: {
          _id: 1,
          timestamp: 1,
          ip: 1,
          browser: 1,
          os: 1,
          device: 1,
          longUrl: "$link.longUrl",
          shortCode: "$link.shortCode",
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    console.error("Error getting analytics:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { logVisit, getAnalyticsByUser };
