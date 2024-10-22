const { Subject, Teacher } = require("../models");

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    return res.status(200).json(subjects);
  } catch (error) {
    console.error("Error getting subjects:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลวิชา" });
  }
};

const getTeacherSubjects = async (req, res) => {
  const { tid } = req.params; // รับค่า tid จาก params

  try {
    const teacher = await Teacher.findOne({
      where: { tid },
      include: [
        {
          model: Subject,
          through: { attributes: [] },
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json(teacher.Subjects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addSubject = async (req, res) => {
  const { teacherId, subjectCode, subjectName, subjectPic } = req.body;

  try {
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "ไม่พบอาจารย์ในระบบ" });
    }

    const [newSubject, created] = await Subject.findOrCreate({
      where: { sub_code: subjectCode },
      defaults: {
        sub_name: subjectName,
        sub_pic: subjectPic,
      },
    });

    if (!created) {
      return res.status(409).json({
        message: "รหัสวิชานี้มีอยู่ในระบบแล้ว",
        subject: newSubject,
      });
    }

    // เชื่อมโยงอาจารย์กับวิชาโดยใช้ addSubject (ผ่านความสัมพันธ์ belongsToMany)
    await teacher.addSubject(newSubject);

    // ดึงข้อมูลวิชาพร้อมข้อมูลอาจารย์ที่เชื่อมโยง
    const subjectWithTeacher = await Subject.findOne({
      where: { sub_id: newSubject.sub_id },
      include: [{ model: Teacher, through: { attributes: [] } }], // include Teacher in response
    });

    res.status(201).json({
      message: "เพิ่มรายวิชาและเชื่อมโยงกับอาจารย์สำเร็จ",
      subject: subjectWithTeacher,
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มรายวิชา" });
  }
};

module.exports = { addSubject, getSubjects, getTeacherSubjects };
