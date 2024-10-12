const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  LineID: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  St_fname: {
    type: DataTypes.STRING,
  },
  St_lname: {
    type: DataTypes.STRING,
  },
  St_profile_pic: {
    type: DataTypes.TEXT,
  },
});

module.exports = Student;