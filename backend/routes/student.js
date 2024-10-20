const express = require("express");
const { getStudentByLineID } = require("../controllers/student");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.get("/:lineID", getStudentByLineID);

module.exports = router;
