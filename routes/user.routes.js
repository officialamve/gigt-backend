const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

module.exports = router;
