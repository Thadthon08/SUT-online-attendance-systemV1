const sequelize = require("../config/db");
const { Teacher, Subject } = require("../models");

exports.getTeacherSubjectsCount = async (req, res) => {
  const { tid } = req.params; // รับรหัสอาจารย์จาก request params
  try {
    const teacher = await Teacher.findOne({
      where: { tid },
      include: [
        {
          model: Subject, // ดึงวิชาที่เชื่อมโยงกับอาจารย์
          through: { attributes: [] }, // ไม่ดึงข้อมูลจากตารางกลาง
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found!" });
    }

    const subjectCount = teacher.Subjects.length; // นับจำนวนวิชาที่สอน
    res.json({ subjectCount }); // ส่งจำนวนวิชาที่สอนกลับไป
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงข้อมูลสรุปการเข้าร่วมของนักเรียนในวิชาที่อาจารย์สอน
exports.getAttendanceSummary = async (req, res) => {
  const { tid } = req.params;
  try {
    const attendanceSummary = await sequelize.query(
      `
  SELECT s.sub_name, a.attended_sessions, a.total_sessions, a.attendance_rate
  FROM "AttendanceSummaries" a  -- ใช้ชื่อตาราง AttendanceSummaries
  JOIN "TeacherSubjects" ts ON ts.sub_id = a.sub_id
  JOIN "Subjects" s ON s.sub_id = ts.sub_id
  WHERE ts.tid = :tid
`,
      {
        replacements: { tid }, // ส่งค่า tid (รหัสอาจารย์) เพื่อกรองข้อมูล
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(attendanceSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClassesCreated = async (req, res) => {
  const { tid } = req.params;

  try {
    const [results] = await sequelize.query(
      `
      SELECT COUNT("ar"."ATR_id") AS "classCount"
      FROM "AttendanceRooms" ar
      JOIN "Subjects" s ON "ar"."sub_id" = "s"."sub_id"
      JOIN "TeacherSubjects" ts ON "ts"."sub_id" = "s"."sub_id"
      WHERE "ts"."tid" = :tid
    `,
      {
        replacements: { tid }, // ส่งค่า tid ไปใช้ใน SQL query
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(results); // เพิ่มบรรทัดนี้เพื่อตรวจสอบโครงสร้างของผลลัพธ์

    // ตรวจสอบว่ามีผลลัพธ์หรือไม่
    if (results && results.classCount !== undefined) {
      res.json({ classCount: results.classCount });
    } else {
      res.json({ classCount: 0 }); // ถ้าไม่มีข้อมูล ให้แสดงค่าเป็น 0
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAverageAttendanceRate = async (req, res) => {
  const { tid } = req.params;
  try {
    const [results] = await sequelize.query(
      `
      SELECT AVG("as"."attendance_rate") AS "averageAttendanceRate"
      FROM "AttendanceSummaries" AS "as"
      JOIN "Subjects" AS "s" ON "as"."sub_id" = "s"."sub_id"
      JOIN "TeacherSubjects" AS "ts" ON "ts"."sub_id" = "s"."sub_id"
      WHERE "ts"."tid" = :tid
    `,
      {
        replacements: { tid },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log("Results from query:", results);

    if (results && results.averageAttendanceRate !== null) {
      res.json({
        averageAttendanceRate: parseFloat(
          results.averageAttendanceRate
        ).toFixed(2),
      });
    } else {
      res.json({ averageAttendanceRate: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalAttendances = async (req, res) => {
  const { tid } = req.params;
  try {
    const [results] = await sequelize.query(
      `
      SELECT COUNT("a"."att_id") AS "totalAttendances"
      FROM "Attendances" AS "a"
      JOIN "AttendanceRooms" AS "ar" ON "a"."ATR_id" = "ar"."ATR_id"
      JOIN "Subjects" AS "s" ON "ar"."sub_id" = "s"."sub_id"
      JOIN "TeacherSubjects" AS "ts" ON "ts"."sub_id" = "s"."sub_id"
      WHERE "ts"."tid" = :tid
    `,
      {
        replacements: { tid },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (results && results.totalAttendances !== null) {
      res.json({ totalAttendances: results.totalAttendances });
    } else {
      res.json({ totalAttendances: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
