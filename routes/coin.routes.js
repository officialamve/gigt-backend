const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/coin.controller");

router.post("/earn", auth, controller.earnCoins);
router.post("/spend", auth, controller.spendCoins);
router.get("/tx", auth, controller.getTransactions);

module.exports = router;
