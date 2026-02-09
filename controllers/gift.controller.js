const User = require("../models/User");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.sendGift = async (req, res) => {
  const { toUserId, toUsername, amount, reason } = req.body;

  if ((!toUserId && !toUsername) || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fromUser = await User.findById(req.user.id).session(session);

    let toUser;
    if (toUserId) {
      toUser = await User.findById(toUserId).session(session);
    } else {
      toUser = await User.findOne({ username: toUsername }).session(session);
    }

    if (!toUser) throw new Error("Receiver not found");
    if (fromUser._id.equals(toUser._id))
      throw new Error("Cannot gift yourself");

    if (fromUser.coins < amount)
      throw new Error("Insufficient coins");

    fromUser.coins -= amount;
    toUser.coins += amount;

    await fromUser.save({ session });
    await toUser.save({ session });

    await Transaction.create(
      [
        {
          userId: fromUser._id,
          type: "SPEND",
          amount,
          reason: reason || "gift_sent"
        },
        {
          userId: toUser._id,
          type: "EARN",
          amount,
          reason: reason || "gift_received"
        }
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: `Gift sent to ${toUser.username}`,
      yourCoins: fromUser.coins
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};
