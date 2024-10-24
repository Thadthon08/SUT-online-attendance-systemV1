const { AttendanceRoom, Subject, Attendance, Student } = require("../models");
const QRCode = require("qrcode");
const sequelize = require("../config/db");

const createAttendanceRoom = async (req, res) => {
  try {
    const { sub_id, ATR_name, ATR_lat, ATR_long, start_time, end_time } =
      req.body;

    const start = new Date(start_time.replace(" ", "T"));
    const end = new Date(end_time.replace(" ", "T"));

    const diffMilliseconds = end - start;
    let countdown_duration =
      diffMilliseconds > 0 ? Math.round(diffMilliseconds / 60000) : 0;

    const subject = await Subject.findByPk(sub_id);
    if (!subject) {
      return res.status(400).json({ error: "ไม่พบวิชานี้ในระบบ" });
    }

    // สร้างห้องเช็คชื่อใหม่
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

    const qrCodeData = await QRCode.toDataURL(`${attendanceRoom.ATR_id}`, {
      scale: 10,
      width: 500,
    });

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

const getRoomsBySubject = async (req, res) => {
  try {
    const { sub_id } = req.params; // รับค่า sub_id จาก URL parameter

    // ดึงข้อมูลห้องทั้งหมดที่สัมพันธ์กับวิชานั้นๆ โดยใช้ sub_id
    const rooms = await AttendanceRoom.findAll({
      where: { sub_id }, // ใช้ sub_id ที่รับมาเป็นเงื่อนไขการค้นหา
      attributes: [
        "ATR_id",
        "ATR_name",
        "ATR_lat",
        "ATR_long",
        "start_time",
        "end_time",
        "created_at",
        "expired_at",
        "qrcode_data",
      ], // เลือกเฉพาะฟิลด์ที่ต้องการ
      order: [["created_at", "DESC"]], // เรียงลำดับตามวันที่สร้างล่าสุด
    });

    // หากไม่พบห้องใดๆ
    if (rooms.length === 0) {
      return res.status(200).json({ message: "No Room records found." });
    }

    // ส่งข้อมูลห้องกลับในรูปแบบ JSON
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลห้องเช็คชื่อ" });
  }
};

const deleteAttendanceRoom = async (req, res) => {
  const { ATR_id } = req.params;
  const t = await sequelize.transaction();

  try {
    const attendanceRoom = await AttendanceRoom.findByPk(ATR_id, {
      transaction: t,
    });
    if (!attendanceRoom) {
      await t.rollback();
      return res.status(404).json({ error: "ไม่พบห้องเช็คชื่อ" });
    }

    const studentsWhoAttended = await Attendance.findAll({
      where: { ATR_id },
      transaction: t,
    });

    await Attendance.destroy({
      where: { ATR_id },
      transaction: t,
    });

    await AttendanceRoom.destroy({
      where: { ATR_id },
      transaction: t,
    });

    await t.commit();
    return res
      .status(200)
      .json({ message: "ลบห้องเช็คชื่อและข้อมูลการเช็คชื่อสำเร็จ" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting attendance room:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบห้องเช็คชื่อ" });
  }
};

module.exports = {
  createAttendanceRoom,
  getRoomsBySubject,
  deleteAttendanceRoom,
};
