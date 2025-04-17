const Link = require("../models/Link");


const getUserLinks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const links = await Link.find({ userId }).sort({ createdAt: -1 });

    const result = links.map((link) => ({
      id: link._id,
      originalUrl: link.longUrl,
      shortUrl: `${process.env.CLIENT_URL}/path/${link.shortCode}`,
      totalClicks: link.clickCount,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      isExpired: link.expiresAt ? new Date() > link.expiresAt : false,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching links:", err);
    res.status(500).json({ message: "Failed to fetch links" });
  }
};



module.exports={getUserLinks}