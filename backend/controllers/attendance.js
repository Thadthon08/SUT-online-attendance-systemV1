const { Attendance, AttendanceRoom, Student } = require("../models");

const checkInAttendance = async (req, res) => {
  try {
    const { ATR_id, sid, att_lat, att_long } = req.body;

    const attendanceRoom = await AttendanceRoom.findByPk(ATR_id);
    if (!attendanceRoom) {
      return res.status(404).json({ error: "ไม่พบห้องเช็คชื่อ" });
    }

    // ตรวจสอบว่านักศึกษา (Student) มีอยู่จริงหรือไม่
    const student = await Student.findByPk(sid);
    if (!student) {
      return res.status(404).json({ error: "ไม่พบนักศึกษา" });
    }

    // ตรวจสอบว่านักศึกษาได้เช็คชื่อไปแล้วหรือไม่
    const existingAttendance = await Attendance.findOne({
      where: { ATR_id, sid },
    });

    if (existingAttendance) {
      return res.status(400).json({ error: "คุณได้เช็คชื่อไปแล้ว" });
    }

    // บันทึกการเช็คชื่อ
    const attendance = await Attendance.create({
      ATR_id,
      sid,
      att_lat,
      att_long,
      att_time: new Date(), // บันทึกเวลาปัจจุบัน
    });

    return res.status(201).json({
      message: "เช็คชื่อสำเร็จ",
      attendance,
    });
  } catch (error) {
    console.error("Error during attendance check-in:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเช็คชื่อ" });
  }
};

module.exports = { checkInAttendance };
