const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getAnalyticsByUser } = require("../controllers/analyticsController");

router.get("/", authMiddleware, getAnalyticsByUser);

module.exports = router;
