const { Subject, Teacher } = require("../models");

// Get all subjects with teachers
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [{ model: Teacher, through: { attributes: [] } }], // include Teacher in response
    });

    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error getting subjects:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลรายวิชา" });
  }
};

// Add a new subject and link it with a teacher
const addSubject = async (req, res) => {
  const { teacherId, subjectCode, subjectName, subjectPic } = req.body;

  try {
    // ตรวจสอบว่าอาจารย์มีอยู่ในระบบหรือไม่
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "ไม่พบอาจารย์ในระบบ" });
    }

    // ตรวจสอบว่ามีวิชาที่มี subjectCode นี้อยู่แล้วหรือไม่
    const [newSubject, created] = await Subject.findOrCreate({
      where: { sub_code: subjectCode },
      defaults: {
        sub_name: subjectName,
        sub_pic: subjectPic,
      },
    });

    // เชื่อมโยงอาจารย์กับวิชาโดยใช้ addSubject (ผ่านความสัมพันธ์ belongsToMany)
    await teacher.addSubject(newSubject);

    // ดึงข้อมูลวิชาพร้อมข้อมูลอาจารย์ที่เชื่อมโยง
    const subjectWithTeacher = await Subject.findOne({
      where: { sub_id: newSubject.sub_id },
      include: [{ model: Teacher, through: { attributes: [] } }], // include Teacher in response
    });

    res.status(201).json({
      message: created
        ? "เพิ่มรายวิชาและเชื่อมโยงกับอาจารย์สำเร็จ"
        : "เชื่อมโยงอาจารย์กับวิชาสำเร็จ (วิชามีอยู่แล้ว)",
      subject: subjectWithTeacher,
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มรายวิชา" });
  }
};

module.exports = { addSubject, getSubjects };
