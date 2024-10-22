// routes/attendanceRoom.js
const express = require("express");
const {
  createAttendanceRoom,
  deleteAttendanceRoom,
} = require("../controllers/attendanceRoom");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.post("/create", createAttendanceRoom);
router.delete("/:ATR_id", deleteAttendanceRoom);

module.exports = router;
