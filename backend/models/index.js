const sequelize = require("../config/db");
const Student = require("./student");
const Teacher = require("./teacher");
const Subject = require("./subject");
const AttendanceRoom = require("./attendance_Room");
const Attendance = require("./attendance");
const AttendanceSummary = require("./attendance_Summary");
const TeacherSubject = require("./teacher_subject");
const SubjectStudent = require("./subject_student");

// Sync โมเดลทั้งหมด
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to sync models:", err);
  });

module.exports = {
  Student,
  Teacher,
  Subject,
  AttendanceRoom,
  Attendance,
  AttendanceSummary,
  TeacherSubject,
  SubjectStudent,
};
