const { nanoid } = require("nanoid");
const Link = require("../models/Link");

const BASE_URL = process.env.BASE_URL;

const createShortLink = async (req, res) => {
  const { originalUrl, customAlias, expirationDate } = req.body;
  const userId = req.user.userId;

  try {
    let restrictions=['login','create','dashboard'];
    let shortCode = customAlias || nanoid(6);

    const existing = await Link.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({ message: "Custom alias already in use" });
    }

    const restricted=restrictions.includes(customAlias);
    if(restricted){
      return res.status(400).json({message:"Custom alias provided can not be used"})
    }

    const newLink = await Link.create({
      longUrl:originalUrl,
      shortCode,
      userId,
      expiresAt: expirationDate ? new Date(expirationDate) : undefined,
    });

    res.status(201).json({
      shortUrl: `${process.env.CLIENT_URL}/path/${shortCode}`,
      ...newLink._doc,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const redirectToOriginal = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const link = await Link.findOne({ shortCode });
    if (!link) return res.status(404).send("Link not found");

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).send("Link expired");
    }

    link.clickCount += 1;
    await link.save();

    setImmediate(() => require("./analyticsController").logVisit(req, link._id));
    res.status(200).json(link.longUrl);
  } catch (err) {
    res.status(500).send("Error redirecting");
  }
};

module.exports = { createShortLink, redirectToOriginal };
