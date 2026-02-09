const User = require("../models/User");
const Transaction = require("../models/Transaction");

// SERVER-SIDE ONLY: never trust client balances
exports.earnCoins = async (req, res) => {
  const { amount, reason } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const user = await User.findById(req.user.id);
  user.coins += amount;
  await user.save();

  await Transaction.create({
    userId: user._id,
    type: "EARN",
    amount,
    reason: reason || "earn"
  });

  res.json({ coins: user.coins });
};

exports.spendCoins = async (req, res) => {
  const { amount, reason } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const user = await User.findById(req.user.id);
  if (user.coins < amount) return res.status(400).json({ message: "Insufficient coins" });

  user.coins -= amount;
  await user.save();

  await Transaction.create({
    userId: user._id,
    type: "SPEND",
    amount,
    reason: reason || "spend"
  });

  res.json({ coins: user.coins });
};

exports.getTransactions = async (req, res) => {
  const tx = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(tx);
};
