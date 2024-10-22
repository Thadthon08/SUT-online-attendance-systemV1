const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const authenticateJWT = require("./middlewares/auth.middleware");
var cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());

// ใช้งานเส้นทางของ user
app.use("/api/auth", require("./routes/auth"));
app.use("/api/room", authenticateJWT, require("./routes/attendanceRoom"));
app.use("/line", require("./routes/line"));
app.use("/api/subject", authenticateJWT, require("./routes/subject"));
app.use("/api/checkin", require("./routes/attendance"));
app.use("/api/attsum", require("./routes/attendanceSum"));
app.use("/api/student", require("./routes/student"));
app.use("/api/teacher", require("./routes/teacher"));

// เริ่มต้นเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the db:", error);
  }
});
