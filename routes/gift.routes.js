const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/gift.controllers");

router.post("/send", auth, controller.sendGift);

module.exports = router;
