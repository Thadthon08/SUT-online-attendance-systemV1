const express = require("express");
const { handleWebhook } = require("../controllers/line");
const router = express.Router();

router.post("/webhook", handleWebhook);

module.exports = router;
