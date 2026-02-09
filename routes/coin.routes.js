const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { earnCoins, spendCoins, getTransactions } = require("../controllers/coin.controller");

router.post("/earn", auth, earnCoins);
router.post("/spend", auth, spendCoins);
router.get("/history", auth, getTransactions);

module.exports = router;
