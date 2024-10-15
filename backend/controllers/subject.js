const { Subject } = require("../models");

// function to get all subjects

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    return res.status(200).json(subjects);
  } catch (error) {
    console.error("Error getting subjects:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลวิชา" });
  }
};

module.exports = { getSubjects };
