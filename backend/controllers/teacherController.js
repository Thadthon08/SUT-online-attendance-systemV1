const { Teacher, Subject, AttendanceRoom, Attendance } = require("../models");

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

exports.getClassesCreated = async (req, res) => {
  const { tid } = req.params;

  try {
    const teacher = await Teacher.findOne({ where: { tid } });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const subjects = await Subject.findAll({
      include: [
        {
          model: Teacher,
          where: { tid },
          through: { attributes: [] },
        },
        {
          model: AttendanceRoom,
        },
      ],
    });
    if (!subjects || subjects.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes found for this teacher." });
    }

    const classes = subjects.map((subject) => subject.AttendanceRooms).flat();
    const classCount = classes.length;

    if (classCount === 0) {
      return res
        .status(404)
        .json({ message: "No classes found for this teacher." });
    }

    res.status(200).json({ classCount: classCount.toString() });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Error retrieving classes." });
  }
};

exports.getAverageAttendanceRate = async (req, res) => {
  const { tid } = req.params; // รับค่า tid จาก URL parameter

  try {
    // ตรวจสอบว่าครูมีอยู่ในระบบหรือไม่
    const teacher = await Teacher.findOne({ where: { tid } });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // ดึงข้อมูลคลาสที่อาจารย์คนนี้สร้าง
    const attendanceRooms = await AttendanceRoom.findAll({
      include: [
        {
          model: Subject,
          include: [
            {
              model: Teacher,
              where: { tid }, // กรองตาม tid ของครู
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    // ตรวจสอบว่ามีคลาสที่อาจารย์สร้างหรือไม่
    if (attendanceRooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes found for this teacher." });
    }

    let totalAttendances = 0;
    let totalClasses = attendanceRooms.length;

    // ดึงข้อมูลการเข้าร่วมของนักเรียนในแต่ละคลาส
    for (const room of attendanceRooms) {
      const attendances = await Attendance.count({
        where: { ATR_id: room.ATR_id },
      });
      totalAttendances += attendances;
    }

    // คำนวณอัตราการเข้าร่วมเฉลี่ย (average attendance rate)
    const averageAttendanceRate =
      totalClasses > 0 ? (totalAttendances / totalClasses) * 100 : 0;

    // ส่งผลลัพธ์กลับ
    res
      .status(200)
      .json({ averageAttendanceRate: averageAttendanceRate.toFixed(2) });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ message: "Error retrieving average attendance rate." });
  }
};

// exports.getAttendanceRateForAllSubjects = async (req, res) => {
//   const { tid } = req.params; // รับค่า tid จาก URL parameter

//   try {
//     const subjects = await Subject.findAll({
//       include: [
//         {
//           model: Teacher,
//           where: { tid }, // กรองตาม tid ของครู
//           through: { attributes: [] }, // ไม่ดึงข้อมูลจากตารางกลาง
//         },
//         {
//           model: AttendanceRoom, // เชื่อมโยงกับห้องเช็คชื่อ
//         },
//       ],
//     });

//     if (subjects.length === 0) {
//       return res.status(404).json({ message: "ไม่พบวิชาที่อาจารย์สอน" });
//     }

//     let totalClasses = 0;
//     let totalAttendances = 0;

//     const attendanceRates = await Promise.all(
//       subjects.map(async (subject) => {
//         const attendanceRooms = subject.AttendanceRooms;

//         let subjectClasses = 0;
//         let subjectAttendances = 0;

//         for (const room of attendanceRooms) {
//           const attendances = await Attendance.count({
//             where: { ATR_id: room.ATR_id },
//           });
//           subjectAttendances += attendances;
//           subjectClasses += 1;
//         }

//         totalClasses += subjectClasses;
//         totalAttendances += subjectAttendances;

//         const attendanceRate =
//           subjectClasses > 0 ? (subjectAttendances / subjectClasses) * 100 : 0;

//         return {
//           subject: subject.sub_name,
//           attendanceRate: attendanceRate.toFixed(2) + "%",
//         };
//       })
//     );

//     const overallAttendanceRate =
//       totalClasses > 0 ? (totalAttendances / totalClasses) * 100 : 0;

//     return res.status(200).json({
//       attendanceRates,
//       overallAttendanceRate: overallAttendanceRate.toFixed(2) + "%",
//     });
//   } catch (error) {
//     console.error("Error retrieving attendance rates:", error);
//     return res
//       .status(500)
//       .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลอัตราการเข้าร่วม" });
//   }
// };

exports.getAttendanceRateForAllSubjects = async (req, res) => {
  const { tid } = req.params; // รับค่า tid จาก URL parameter

  try {
    const subjects = await Subject.findAll({
      include: [
        {
          model: Teacher,
          where: { tid },
          through: { attributes: [] },
        },
        {
          model: AttendanceRoom,
        },
      ],
    });

    if (subjects.length === 0) {
      return res.status(404).json({ message: "ไม่พบวิชาที่อาจารย์สอน" });
    }

    const attendanceRates = await Promise.all(
      subjects.map(async (subject) => {
        const attendanceRooms = subject.AttendanceRooms;

        let subjectClasses = 0;
        let subjectAttendances = 0;

        for (const room of attendanceRooms) {
          const attendances = await Attendance.count({
            where: { ATR_id: room.ATR_id },
          });
          subjectAttendances += attendances;
          subjectClasses += 1;
        }

        const attendanceRate =
          subjectClasses > 0 ? (subjectAttendances / subjectClasses) * 100 : 0;

        return {
          subject: subject.sub_name,
          sub_code: subject.sub_code, // เพิ่ม sub_code ในผลลัพธ์
          attendanceRate: attendanceRate.toFixed(2) + "%",
        };
      })
    );

    return res.status(200).json(attendanceRates);
  } catch (error) {
    console.error("Error retrieving attendance rates:", error);
    return res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลอัตราการเข้าร่วม" });
  }
};

exports.getTotalAttendances = async (req, res) => {
  const { tid } = req.params;

  try {
    const totalAttendances = await Attendance.count({
      include: [
        {
          model: AttendanceRoom,
          include: [
            {
              model: Subject,
              include: [
                {
                  model: Teacher,
                  where: { tid },
                },
              ],
            },
          ],
        },
      ],
    });

    if (totalAttendances > 0) {
      res.json({ totalAttendances: totalAttendances.toString() });
    } else {
      res.json({ totalAttendances: "0" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
