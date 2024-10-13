// controllers/attendanceRoom.js
const { AttendanceRoom, Subject } = require("../models");
const QRCode = require("qrcode"); // ไลบรารีสำหรับสร้าง QR Code

// ฟังก์ชันสำหรับสร้างห้องเช็คชื่อใหม่
const createAttendanceRoom = async (req, res) => {
  try {
    const {
      sub_id,
      ATR_name,
      ATR_lat,
      ATR_long,
      start_time,
      end_time,
      countdown_duration,
    } = req.body;

    // ตรวจสอบว่ามีวิชานี้อยู่ในฐานข้อมูลหรือไม่
    const subject = await Subject.findByPk(sub_id);
    if (!subject) {
      return res.status(400).json({ error: "ไม่พบวิชานี้ในระบบ" });
    }

    // บันทึกห้องเช็คชื่อใหม่ในฐานข้อมูล
    const attendanceRoom = await AttendanceRoom.create({
      sub_id,
      ATR_name,
      ATR_lat,
      ATR_long,
      start_time,
      end_time,
      countdown_duration,
      expired_at: new Date(end_time), // ตั้งค่าเวลาหมดอายุของ QR Code เป็น end_time
    });

    // สร้างข้อมูล QR Code ที่จะฝังลงไป (เช่น ATR_id และ Subject ID)
    const roomData = {
      ATR_id: attendanceRoom.ATR_id, // ใช้ ATR_id ที่ถูกสร้างโดยฐานข้อมูล
      subject_id: sub_id,
    };

    const qrCodeData = await QRCode.toDataURL(JSON.stringify(roomData)); // สร้าง QR Code เป็น Data URL

    // อัปเดต QR Code ลงในฐานข้อมูล
    attendanceRoom.qrcode_data = qrCodeData;
    await attendanceRoom.save();

    return res.status(201).json({
      message: "สร้างห้องเช็คชื่อสำเร็จ",
      attendanceRoom,
      qrCodeData,
    });
  } catch (error) {
    console.error("Error creating attendance room:", error);
    return res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการสร้างห้องเช็คชื่อ" });
  }
};

module.exports = { createAttendanceRoom };
