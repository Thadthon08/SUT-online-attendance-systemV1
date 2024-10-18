const express = require("express");
const {
  registerStudent,
  unregisterStudent,
  verify,
} = require("../controllers/line");
const router = express.Router();

router.post("/register", registerStudent);
router.delete("/unregister", unregisterStudent);
router.get("/verify/:LineID", verify);

module.exports = router;
