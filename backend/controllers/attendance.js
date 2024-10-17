const { Attendance, AttendanceRoom, Student } = require("../models");
const sequelize = require("../config/db");

const checkInAttendance = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { ATR_id, sid, att_lat, att_long } = req.body;

    const attendanceRoom = await AttendanceRoom.findByPk(ATR_id, {
      transaction: t,
    });
    if (!attendanceRoom) {
      await t.rollback();
      return res.status(404).json({ error: "ไม่พบห้องเช็คชื่อ" });
    }

    const student = await Student.findByPk(sid, { transaction: t });
    if (!student) {
      await t.rollback();
      return res.status(404).json({ error: "ไม่พบนักศึกษา" });
    }

    const existingAttendance = await Attendance.findOne({
      where: { ATR_id, sid },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (existingAttendance) {
      await t.rollback();
      return res.status(400).json({ error: "คุณได้เช็คชื่อไปแล้ว" });
    }

    const attendance = await Attendance.create(
      {
        ATR_id,
        sid,
        att_lat,
        att_long,
        att_time: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      message: "เช็คชื่อสำเร็จ",
      attendance,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error during attendance check-in:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเช็คชื่อ" });
  }
};

module.exports = { checkInAttendance };
