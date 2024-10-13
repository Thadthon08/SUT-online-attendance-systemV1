// routes/attendanceRoom.js
const express = require("express");
const { createAttendanceRoom } = require("../controllers/attendanceRoom");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.post("/room", createAttendanceRoom);

module.exports = router;
