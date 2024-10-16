// routes/attendanceRoom.js
const express = require("express");
const { checkInAttendance } = require("../controllers/attendance");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.post("/", checkInAttendance);

module.exports = router;
