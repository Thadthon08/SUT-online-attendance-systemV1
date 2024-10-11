const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./student");
const Subject = require("./subject");

const SubjectStudent = sequelize.define("SubjectStudent", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// ตั้งความสัมพันธ์
Student.belongsToMany(Subject, { through: SubjectStudent, foreignKey: "sid" });
Subject.belongsToMany(Student, {
  through: SubjectStudent,
  foreignKey: "sub_id",
});

module.exports = SubjectStudent;
