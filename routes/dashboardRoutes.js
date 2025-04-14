const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserLinks,
} = require("../controllers/dashboardController");

router.get("/links", authMiddleware, getUserLinks);

module.exports = router;
