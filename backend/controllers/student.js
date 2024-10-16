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

const updateProfilePicture = async (req, res) => {
  try {
    const { sid } = req.params;
    const { profilePicUrl } = req.body;

    if (!profilePicUrl) {
      return res
        .status(400)
        .json({ message: "Profile picture URL is required" });
    }

    const student = await Student.findByPk(sid);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.St_profile_pic = profilePicUrl;
    await student.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: profilePicUrl,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getStudentByLineID,
  updateProfilePicture,
};
