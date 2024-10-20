const sequelize = require("../config/db");
const Student = require("./student");
const Teacher = require("./teacher");
const Subject = require("./subject");
const AttendanceRoom = require("./attendance_Room");
const Attendance = require("./attendance");
const AttendanceSummary = require("./attendance_Summary");
const TeacherSubject = require("./teacher_subject");

Teacher.belongsToMany(Subject, {
  through: TeacherSubject,
  foreignKey: "tid",
  onDelete: "CASCADE",
});

Subject.belongsToMany(Teacher, {
  through: TeacherSubject,
  foreignKey: "sub_id",
  onDelete: "CASCADE",
});

// Sync โมเดลทั้งหมด
sequelize
  .sync({ Alter: true })
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
};
