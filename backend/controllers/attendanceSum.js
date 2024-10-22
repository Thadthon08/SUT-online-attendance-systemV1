const { AttendanceSummary, Subject, Student } = require("../models");

const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { sid } = req.params;

    // ตรวจสอบว่านักศึกษามีอยู่ในระบบหรือไม่
    const student = await Student.findByPk(sid);
    if (!student) {
      return res.status(404).json({ error: "ไม่พบนักศึกษา" });
    }

    // ดึงข้อมูลการสรุปการเช็คชื่อของนักศึกษา
    const summaries = await AttendanceSummary.findAll({
      where: { sid },
      include: [
        {
          model: Subject, // ดึงข้อมูลวิชาที่เชื่อมโยงกับ AttendanceSummary
          attributes: ["sub_name", "sub_code"],
        },
      ],
    });

    if (summaries.length === 0) {
      return res.status(200).json({ message: "ไม่มีข้อมูลสรุปการเช็คชื่อ" });
    }

    // แปลงข้อมูลเพื่อส่งกลับ
    const summaryData = summaries.map((summary) => ({
      subjectName: summary.Subject.sub_name,
      subjectCode: summary.Subject.sub_code,
      totalSessions: summary.total_sessions,
      attendedSessions: summary.attended_sessions,
      attendanceRate: summary.attendance_rate.toFixed(2), // แสดงเป็นเปอร์เซ็นต์
    }));

    // ส่งข้อมูลในรูปแบบ JSON
    res.status(200).json({
      student: {
        sid: student.sid,
        name: `${student.St_fname} ${student.St_lname}`,
      },
      attendanceSummary: summaryData,
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลสรุปการเช็คชื่อ" });
  }
};

module.exports = {
  getStudentAttendanceSummary,
};
