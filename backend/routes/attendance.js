// routes/attendanceRoom.js
const express = require("express");
const {
  checkInAttendance,
  getAttendanceForRoom,
} = require("../controllers/attendance");
const router = express.Router();

function mobileOnly(req, res, next) {
  const userAgent = req.headers["user-agent"] || "";
  if (/mobile/i.test(userAgent)) {
    next();
  } else {
    res.status(403).send("สามารถเข้าถึงได้เฉพาะจากโทรศัพท์มือถือเท่านั้น");
  }
}

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.post("/", mobileOnly, checkInAttendance);
router.get("/:ATR_id", getAttendanceForRoom);

module.exports = router;
