const express = require("express");
const router = express.Router();
const {
  getTeacherSubjectsCount,
  getAttendanceSummary,
  getClassesCreated,
  getAverageAttendanceRate,
  getTotalAttendances,
} = require("../controllers/teacherController");

// Route สำหรับดึงจำนวนวิชาที่อาจารย์สอน
router.get("/:tid/subjects", getTeacherSubjectsCount);

// Route สำหรับดึงข้อมูลสรุปการเข้าร่วมของนักเรียนในวิชาที่อาจารย์สอน
router.get("/:tid/attendance-summary", getAttendanceSummary);

router.get("/:tid/class", getClassesCreated);
router.get("/:tid/avg", getAverageAttendanceRate);
router.get("/:tid/total", getTotalAttendances);

module.exports = router;
