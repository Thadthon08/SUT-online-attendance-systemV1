const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/userController");

// Route สร้างผู้ใช้ใหม่
router.post("/users", createUser);

// Route เรียกข้อมูลผู้ใช้ทั้งหมด
router.get("/users", getUsers);

module.exports = router;
