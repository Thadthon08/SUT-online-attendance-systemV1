const express = require("express");
const { registerStudent, unregisterStudent } = require("../controllers/line");
const router = express.Router();

router.post("/register", registerStudent);
router.delete("/unregister", unregisterStudent);

module.exports = router;
