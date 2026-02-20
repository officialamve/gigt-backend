const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");

/* ================= SEND COINS ================= */

router.post("/send", auth, async (req, res) => {
  try {
    const { receiverUsername, amount } = req.body;

    if (!receiverUsername || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender.username === receiverUsername) {
      return res.status(400).json({ message: "Cannot send coins to yourself" });
    }

    if (sender.coins < amount) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    sender.coins -= amount;
    receiver.coins += amount;

    await sender.save();
    await receiver.save();

    res.json({ message: "Coins sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
