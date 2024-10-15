const express = require("express");
const { getSubjects } = require("../controllers/subject");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.get("/", getSubjects);

module.exports = router;
