const { Student } = require("../models");
const line = require("@line/bot-sdk");
const axios = require("axios");
const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

async function changeRichMenu(uid) {
  const richMenuId = process.env.LINE_RICH_MENU_ID;
  const url = `https://api.line.me/v2/bot/user/${uid}/richmenu/${richMenuId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  };

  try {
    const response = await axios.post(url, {}, { headers });
    console.log("Rich menu changed successfully:", response.data);
  } catch (error) {
    console.error(
      "Error changing rich menu:",
      error.response ? error.response.data : error.message
    );
  }
}

async function unlinkRichMenu(uid) {
  const url = `https://api.line.me/v2/bot/user/${uid}/richmenu`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  };

  try {
    const response = await axios.delete(url, { headers });

    console.log("Rich menu unlinked successfully:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Failed to unlink rich menu:", error.response.data);
    } else {
      console.error("Error unlinking rich menu:", error.message);
    }
  }
}

async function registerStudent(req, res) {
  const { sid, LineID, St_fname, St_lname, St_profile_pic } = req.body;

  try {
    const newStudent = await Student.create({
      sid,
      LineID,
      St_fname,
      St_lname,
      St_profile_pic,
    });

    await changeRichMenu(LineID);

    res.status(201).json({
      status: "success",
      message: "Student added and rich menu changed successfully!",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({
      status: "fail",
      message: "Unable to add student",
    });
  }
}

async function unregisterStudent(req, res) {
  const { LineID } = req.body;

  try {
    const student = await Student.destroy({ where: { LineID } });

    if (student) {
      await unlinkRichMenu(LineID);

      res.status(200).json({
        status: "success",
        message: "Student unregistered and rich menu unlinked successfully!",
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }
  } catch (error) {
    console.error("Error unregistering student:", error);
    res.status(500).json({
      status: "fail",
      message: "Unable to unregister student",
    });
  }
}

async function verify(req, res) {
  const { LineID } = req.params;

  try {
    const user = await Student.findOne({ where: { LineID } });

    if (user) {
      const response = {
        status: "success",
      };
      res.status(200).json(response);
    } else {
      const response = {
        status: "fail",
        message: "no data",
      };
      res.status(404).json(response);
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ status: "fail", message: "An error occurred" });
  }
}

module.exports = { registerStudent, unregisterStudent, verify };
