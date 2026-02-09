const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { sendGift } = require("../controllers/gift.controller");

router.post("/send", auth, sendGift);

module.exports = router;
