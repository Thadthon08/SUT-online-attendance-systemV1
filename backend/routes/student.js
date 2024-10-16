const express = require("express");
const {
  getStudentByLineID,
  updateProfilePicture,
} = require("../controllers/student");
const router = express.Router();

// เส้นทางสำหรับสร้างห้องเช็คชื่อใหม่
router.get("/:lineID", getStudentByLineID);
router.put("/:sid/profile-pic", updateProfilePicture);

module.exports = router;
