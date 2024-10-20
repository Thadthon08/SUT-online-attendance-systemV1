// controllers/studentController.js
const { Student } = require("../models");

const getStudentByLineID = async (req, res) => {
  try {
    const { lineID } = req.params;

    const student = await Student.findOne({
      where: { LineID: lineID },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by LineID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getStudentByLineID,
};
