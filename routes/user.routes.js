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
    }).select("-password -email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      coins: user.coins,
      isCreator: user.isCreator,
      creatorProfile: user.isCreator ? {
        displayName: user.creatorProfile?.displayName,
        category: user.creatorProfile?.category,
        bio: user.creatorProfile?.bio,
        verified: user.creatorProfile?.verified
      } : null,
      createdAt: user.createdAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= EXPORT ================= */


router.put("/me/update", auth, async (req, res) => {
  try {
    const { displayName, category, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isCreator) {
      return res.status(403).json({ message: "Not a creator account" });
    }

    if (displayName !== undefined) {
      user.creatorProfile.displayName = displayName;
    }

    if (category !== undefined) {
      user.creatorProfile.category = category;
    }

    if (bio !== undefined) {
      user.creatorProfile.bio = bio;
    }

    await user.save();

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= BECOME CREATOR ================= */

router.post("/become-creator", auth, async (req, res) => {
  try {
    const { displayName, category, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isCreator) {
      return res.status(400).json({ message: "Already a creator" });
    }

    user.isCreator = true;
    user.creatorProfile = {
      displayName,
      category,
      bio,
      verified: false
    };

    await user.save();

    res.json({ message: "Creator profile created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
