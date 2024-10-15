// controllers/attendanceRoom.js
const { AttendanceRoom, Subject } = require("../models");
const QRCode = require("qrcode");

const createAttendanceRoom = async (req, res) => {
  try {
    const { sub_id, ATR_name, ATR_lat, ATR_long, start_time, end_time } =
      req.body;

    const start = new Date(start_time.replace(" ", "T"));
    const end = new Date(end_time.replace(" ", "T"));

    const diffMilliseconds = end - start;
    let countdown_duration;

    if (diffMilliseconds > 0) {
      const diffSeconds = diffMilliseconds / 1000;
      const diffMinutes = diffSeconds / 60;

      countdown_duration = Math.round(diffMinutes);
    } else {
      countdown_duration = 0;
    }

    const subject = await Subject.findByPk(sub_id);
    if (!subject) {
      return res.status(400).json({ error: "ไม่พบวิชานี้ในระบบ" });
    }

    const attendanceRoom = await AttendanceRoom.create({
      sub_id,
      ATR_name,
      ATR_lat,
      ATR_long,
      start_time,
      end_time,
      countdown_duration,
      expired_at: new Date(end_time.replace(" ", "T")),
    });

    const roomData = {
      ATR_id: attendanceRoom.ATR_id,
      subject_id: sub_id,
    };

    const qrCodeData = await QRCode.toDataURL(JSON.stringify(roomData));

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
