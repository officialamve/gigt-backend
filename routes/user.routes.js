const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

/* ================= GET CURRENT USER ================= */

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("posts")
      .populate("owned")
      .populate("gifts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET USER BY USERNAME ================= */

router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    })
      .select("-password")
      .populate("posts")
      .populate("owned")
      .populate("gifts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= EXPORT ================= */

module.exports = router;