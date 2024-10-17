const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Teacher = require("./teacher"); // ต้อง import Teacher
const TeacherSubject = require("./teacher_subject"); // import ตารางกลาง

const Subject = sequelize.define("Subject", {
  sub_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sub_code: {
    type: DataTypes.STRING,
    unique: true,
  },
  sub_name: {
    type: DataTypes.STRING,
  },
  sub_pic: {
    type: DataTypes.TEXT,
  },
});

module.exports = Subject;
