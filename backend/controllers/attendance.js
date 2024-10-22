const {
  Attendance,
  AttendanceRoom,
  Student,
  AttendanceSummary,
} = require("../models");
const sequelize = require("../config/db");

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// const checkInAttendance = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { ATR_id, sid, att_lat, att_long } = req.body;

//     const attendanceRoom = await AttendanceRoom.findByPk(ATR_id, {
//       transaction: t,
//     });
//     if (!attendanceRoom) {
//       await t.rollback();
//       return res.status(404).json({ error: "ไม่พบห้องเช็คชื่อ" });
//     }

//     const currentTime = new Date();
//     if (attendanceRoom.expired_at && attendanceRoom.expired_at < currentTime) {
//       await t.rollback();
//       return res.status(400).json({
//         error: "ไม่สามารถเช็คชื่อได้เนื่องจากหมดเวลาแล้ว",
//       });
//     }

//     const student = await Student.findByPk(sid, { transaction: t });
//     if (!student) {
//       await t.rollback();
//       return res.status(404).json({ error: "ไม่พบนักศึกษา" });
//     }

//     const existingAttendance = await Attendance.findOne({
//       where: { ATR_id, sid },
//       lock: t.LOCK.UPDATE,
//       transaction: t,
//     });

//     if (existingAttendance) {
//       await t.rollback();
//       return res.status(400).json({ error: "คุณได้เช็คชื่อไปแล้ว" });
//     }

//     const distance = haversineDistance(
//       attendanceRoom.ATR_lat,
//       attendanceRoom.ATR_long,
//       att_lat,
//       att_long
//     );
//     if (distance > 1) {
//       await t.rollback();
//       return res.status(400).json({
//         error: `เช็คชื่อไม่สำเร็จ ระยะห่าง ${distance.toFixed(2)} กิโลเมตร`,
//       });
//     }

//     const attendance = await Attendance.create(
//       {
//         ATR_id,
//         sid,
//         att_lat,
//         att_long,
//         att_time: new Date(),
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     return res.status(201).json({
//       message: "เช็คชื่อสำเร็จ",
//       attendance,
//     });
//   } catch (error) {
//     await t.rollback();
//     console.error("Error during attendance check-in:", error);
//     return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเช็คชื่อ" });
//   }
// };

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

    const currentTime = new Date();
    if (attendanceRoom.expired_at && attendanceRoom.expired_at < currentTime) {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "ไม่สามารถเช็คชื่อได้เนื่องจากหมดเวลาแล้ว" });
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

    const distance = haversineDistance(
      attendanceRoom.ATR_lat,
      attendanceRoom.ATR_long,
      att_lat,
      att_long
    );
    if (distance > 1) {
      await t.rollback();
      return res.status(400).json({
        error: `เช็คชื่อไม่สำเร็จ ระยะห่าง ${distance.toFixed(2)} กิโลเมตร`,
      });
    }

    // บันทึกการเช็คชื่อ
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

    // อัปเดต attended_sessions และ attendance_rate ของนักเรียน
    const summary = await AttendanceSummary.findOne({
      where: { sid, sub_id: attendanceRoom.sub_id },
      transaction: t,
    });

    if (summary) {
      summary.attended_sessions += 1;
      summary.attendance_rate =
        (summary.attended_sessions / summary.total_sessions) * 100;
      await summary.save({ transaction: t });
    }

    await t.commit();
    return res.status(201).json({ message: "เช็คชื่อสำเร็จ", attendance });
  } catch (error) {
    await t.rollback();
    console.error("Error during attendance check-in:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเช็คชื่อ" });
  }
};

const getAttendanceForRoom = async (req, res) => {
  try {
    const { ATR_id } = req.params;

    const attendanceRecords = await Attendance.findAll({
      where: { ATR_id },
      include: [
        {
          model: Student,
          attributes: ["sid", "St_fname", "St_lname"],
        },
      ],
      order: [["att_time", "ASC"]],
    });

    if (attendanceRecords.length === 0) {
      return res.status(204).json({ message: "No attendance records found." });
    }

    res.status(200).json({
      roomId: ATR_id,
      totalCheckedIn: attendanceRecords.length,
      students: attendanceRecords.map((record) => ({
        sid: record.Student.sid,
        name: `${record.Student.St_fname} ${record.Student.St_lname}`,
        checkInTime: record.att_time,
      })),
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการเช็คชื่อ" });
  }
};

module.exports = {
  checkInAttendance,
  getAttendanceForRoom,
};
