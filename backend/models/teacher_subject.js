const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Teacher = require("./teacher");
const Subject = require("./subject");

const TeacherSubject = sequelize.define("TeacherSubject", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// ตั้งความสัมพันธ์
Teacher.belongsToMany(Subject, { through: TeacherSubject, foreignKey: "tid" });
Subject.belongsToMany(Teacher, {
  through: TeacherSubject,
  foreignKey: "sub_id",
});

module.exports = TeacherSubject;
