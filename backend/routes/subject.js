const express = require("express");
const {
  getSubjects,
  addSubject,
  getTeacherSubjects,
} = require("../controllers/subject");
const { getRoomsBySubject } = require("../controllers/attendanceRoom");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.get("/", getSubjects);
router.post("/", addSubject);
router.get("/room/:sub_id", getRoomsBySubject);
router.get("/teacher/:tid", getTeacherSubjects);

module.exports = router;
