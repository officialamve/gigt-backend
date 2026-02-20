const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

/* ================= GET CURRENT USER ================= */

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
  .select("-password");

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
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const sixtyDays = 60 * 24 * 60 * 60 * 1000;

    /* ================= USERNAME UPDATE ================= */

    if (req.body.username && req.body.username !== user.username) {

      if (user.usernameChangedAt) {
        const diff = now - user.usernameChangedAt;

        if (diff < sixtyDays) {
          const remainingDays = Math.ceil(
            (sixtyDays - diff) / (1000 * 60 * 60 * 24)
          );

          return res.status(400).json({
            message: `Username can be changed after ${remainingDays} days`
          });
        }
      }

      const existing = await User.findOne({ username: req.body.username });
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }

      user.username = req.body.username;
      user.usernameChangedAt = now;
    }

    /* ================= CREATOR PROFILE ================= */

    if (req.body.displayName !== undefined) {
      user.creatorProfile.displayName = req.body.displayName;
    }

    if (req.body.bio !== undefined) {
      user.creatorProfile.bio = req.body.bio;
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
