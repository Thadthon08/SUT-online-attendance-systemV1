const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Teacher = sequelize.define("Teacher", {
  tid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  fname: {
    type: DataTypes.STRING,
  },
  lname: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  profile_pic: {
    type: DataTypes.TEXT,
  },
});

module.exports = Teacher;
