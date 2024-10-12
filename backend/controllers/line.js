const { Student } = require("../models"); // Import โมเดล Student
const line = require("@line/bot-sdk");
const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

let studentData = {}; // Object สำหรับเก็บข้อมูล Student ID ชั่วคราว

// Webhook handler
const handleWebhook = async (req, res) => {
  const events = req.body.events;

  // จัดการ event ทั้งหมดจาก LINE
  Promise.all(events.map(handleEvent))
    .then((result) => res.status(200).json(result)) // ตอบกลับ HTTP 200
    .catch((err) => {
      console.error("Error handling events:", err);
      res.status(500).end();
    });
};

// ฟังก์ชันจัดการ event จาก LINE
const handleEvent = async (event) => {
  if (event.type === "message" && event.message.type === "text") {
    const lineId = event.source.userId; // ดึง Line ID จาก event
    const messageText = event.message.text.trim(); // ข้อความที่ผู้ใช้ส่งมา

    if (messageText === "ทดสอบระบบ") {
      const reply = {
        type: "text",
        text: "ระบบทำงานปกติ",
      };
      return client.replyMessage(event.replyToken, reply);
    }

    // กรณีที่ผู้ใช้กดปุ่ม "เชื่อมต่อบัญชี"
    if (messageText === "เชื่อมต่อบัญชีกับรหัสนักศึกษา") {
      // ส่งข้อความให้ผู้ใช้พิมพ์รหัสนักศึกษา
      const reply = {
        type: "text",
        text: "กรุณาพิมพ์รหัสนักศึกษา เช่น BXXXXXXX",
      };
      studentData[lineId] = {}; // สร้าง entry ชั่วคราวสำหรับ Line ID นี้
      return client.replyMessage(event.replyToken, reply);
    }

    // ตรวจสอบว่าเป็น Line ID ที่ต้องการพิมพ์ Student ID หรือไม่
    if (studentData[lineId] && !studentData[lineId].studentId) {
      const studentId = messageText;

      // ตรวจสอบรหัสนักศึกษา (ตัวอย่าง: ตรวจสอบรูปแบบ BXXXXXXX)
      const studentIdPattern = /^B\d{7}$/;
      if (!studentIdPattern.test(studentId)) {
        const reply = {
          type: "text",
          text: "รหัสนักศึกษาไม่ถูกต้อง กรุณาพิมพ์ใหม่อีกครั้ง",
        };
        return client.replyMessage(event.replyToken, reply);
      }

      try {
        // ค้นหาในฐานข้อมูลว่ามี Student ID นี้อยู่หรือไม่
        let student = await Student.findOne({ where: { sid: studentId } });

        // ถ้าไม่เจอให้แจ้งเตือนให้ผู้ใช้ ถ้าเจอให้บันทึกข้อมูล
        if (!student) {
          const reply = {
            type: "text",
            text: "ไม่พบรหัสนักศึกษานี้ในระบบ กรุณาลองใหม่อีกครั้ง",
          };
          return client.replyMessage(event.replyToken, reply);
        }


        // บันทึกข้อมูลรหัสนักศึกษาใน studentData
        studentData[lineId].studentId = studentId;

        // ส่งข้อความตอบกลับผู้ใช้ว่าเชื่อมต่อสำเร็จ
        const reply = {
          type: "text",
          text: `เชื่อมต่อ Line ID กับรหัสนักศึกษา ${studentId} สำเร็จแล้ว!`,
        };
        return client.replyMessage(event.replyToken, reply);
      } catch (error) {
        console.error("Error handling student data:", error);
        const reply = {
          type: "text",
          text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        };
        return client.replyMessage(event.replyToken, reply);
      }
    }
  }

  return Promise.resolve(null); // ถ้าไม่ใช่ event ที่สนใจ ให้ข้ามไป
};

module.exports = { handleWebhook };
