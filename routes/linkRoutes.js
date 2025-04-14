const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createShortLink } = require("../controllers/linkController");

router.post("/", authMiddleware, createShortLink);

module.exports = router;
