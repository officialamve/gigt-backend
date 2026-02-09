const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/gift.controller");

router.post("/send", auth, controller.sendGift);

module.exports = router;
