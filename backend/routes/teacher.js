const express = require("express");
const router = express.Router();
const {
  getTeacherSubjectsCount,
  getClassesCreated,
  getAverageAttendanceRate,
  getTotalAttendances,
  getAttendanceRateForAllSubjects,
} = require("../controllers/teacherController");

// Route สำหรับดึงจำนวนวิชาที่อาจารย์สอน
router.get("/:tid/subjects", getTeacherSubjectsCount);
router.get("/:tid/subjects/rate", getAttendanceRateForAllSubjects);

router.get("/:tid/class", getClassesCreated);
router.get("/:tid/avg", getAverageAttendanceRate);
router.get("/:tid/total", getTotalAttendances);

module.exports = router;
