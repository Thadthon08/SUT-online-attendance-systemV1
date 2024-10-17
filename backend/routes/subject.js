const express = require("express");
const { getSubjects, addSubject } = require("../controllers/subject");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.get("/", getSubjects);
router.post("/", addSubject);

module.exports = router;
