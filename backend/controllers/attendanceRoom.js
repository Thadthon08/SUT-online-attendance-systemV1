const {
  AttendanceRoom,
  Subject,
  AttendanceSummary,
  Student,
} = require("../models");
const QRCode = require("qrcode");

// const createAttendanceRoom = async (req, res) => {
//   try {
//     const { sub_id, ATR_name, ATR_lat, ATR_long, start_time, end_time } =
//       req.body;

//     const start = new Date(start_time.replace(" ", "T"));
//     const end = new Date(end_time.replace(" ", "T"));

//     const diffMilliseconds = end - start;
//     let countdown_duration =
//       diffMilliseconds > 0 ? Math.round(diffMilliseconds / 60000) : 0;

//     const subject = await Subject.findByPk(sub_id);
//     if (!subject) {
//       return res.status(400).json({ error: "ไม่พบวิชานี้ในระบบ" });
//     }

//     const attendanceRoom = await AttendanceRoom.create({
//       sub_id,
//       ATR_name,
//       ATR_lat,
//       ATR_long,
//       start_time,
//       end_time,
//       countdown_duration,
//       expired_at: new Date(end_time.replace(" ", "T")),
//     });

//     const qrCodeData = await QRCode.toDataURL(`${attendanceRoom.ATR_id}`, {
//       scale: 10,
//       width: 500,
//     });

//     attendanceRoom.qrcode_data = qrCodeData;
//     await attendanceRoom.save();

//     return res.status(201).json({
//       message: "สร้างห้องเช็คชื่อสำเร็จ",
//       attendanceRoom,
//       qrCodeData, // ยังคงส่ง QR code กลับมาให้ client
//     });
//   } catch (error) {
//     console.error("Error creating attendance room:", error);
//     return res
//       .status(500)
//       .json({ error: "เกิดข้อผิดพลาดในการสร้างห้องเช็คชื่อ" });
//   }
// };

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

    // ดึงนักเรียนทุกคนที่มีอยู่ในวิชานี้
    const students = await Student.findAll();

    // อัปเดต total_sessions ของนักเรียนแต่ละคนในวิชานี้
    await Promise.all(
      students.map(async (student) => {
        const [summary, created] = await AttendanceSummary.findOrCreate({
          where: { sid: student.sid, sub_id },
          defaults: {
            total_sessions: 0,
            attended_sessions: 0,
            attendance_rate: 0,
          },
        });
        summary.total_sessions += 1;
        summary.attendance_rate =
          (summary.attended_sessions / summary.total_sessions) * 100;
        await summary.save();
      })
    );

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
      return res.status(204);
    }

    // ส่งข้อมูลห้องกลับในรูปแบบ JSON
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลห้องเช็คชื่อ" });
  }
};

module.exports = { createAttendanceRoom, getRoomsBySubject };
