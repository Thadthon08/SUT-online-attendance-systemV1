// routes/attendanceRoom.js
const express = require("express");
const {
  checkInAttendance,
  getAttendanceForRoom,
} = require("../controllers/attendance");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.post("/", checkInAttendance);
router.get("/:ATR_id", getAttendanceForRoom);

module.exports = router;
