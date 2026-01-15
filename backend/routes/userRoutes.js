const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET logged-in user profile
router.get("/me", authMiddleware, (req, res) => {
    res.json(req.user);
});

module.exports = router;
