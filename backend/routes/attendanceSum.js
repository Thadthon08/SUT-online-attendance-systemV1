// routes/attendanceRoom.js
const express = require("express");
const { getStudentAttendanceSummary } = require("../controllers/attendanceSum");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.get("/:sid", getStudentAttendanceSummary);

module.exports = router;
