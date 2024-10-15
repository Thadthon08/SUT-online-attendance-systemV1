const { Student } = require("../models");
const line = require("@line/bot-sdk");
const client = new line.Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

let studentData = {}; 

// Webhook handler
const handleWebhook = async (req, res) => {
  try {
    const events = req.body.events;

    // จัดการ event ทั้งหมดจาก LINE
    const results = await Promise.all(events.map(handleEvent));
    return res.status(200).json(results); // ตอบกลับ HTTP 200
  } catch (err) {
    console.error("Error handling events:", err);
    return res.status(500).end();
  }
};

// ฟังก์ชันจัดการ event จาก LINE
const handleEvent = async (event) => {
  if (event.type === "message" && event.message.type === "text") {
    const lineId = event.source.userId; // ดึง Line ID จาก event
    const messageText = event.message.text.trim(); // ข้อความที่ผู้ใช้ส่งมา

    // ตรวจสอบว่าผู้ใช้พิมพ์ว่า "ทดสอบระบบ"
    if (messageText === "ทดสอบระบบ") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ระบบทำงานปกติ",
      });
    }

    // ตรวจสอบว่า Line ID นี้เคยเชื่อมต่อแล้วหรือไม่
    const existingStudent = await Student.findOne({
      where: { LineID: lineId },
    });
    if (existingStudent) {
      // หาก Line ID นี้ถูกเชื่อมต่อแล้ว
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: `คุณได้เชื่อมต่อกับรหัสนักศึกษา ${existingStudent.sid} แล้ว ไม่สามารถเปลี่ยนแปลงได้`,
      });
    }

    // กรณีที่ผู้ใช้กดปุ่ม "เชื่อมต่อบัญชี"
    if (messageText === "เชื่อมต่อบัญชีกับรหัสนักศึกษา") {
      // ส่งข้อความให้ผู้ใช้พิมพ์รหัสนักศึกษา
      studentData[lineId] = {}; // สร้าง entry ชั่วคราวสำหรับ Line ID นี้
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "กรุณาพิมพ์รหัสนักศึกษา เช่น BXXXXXXX",
      });
    }

    // ตรวจสอบว่าเป็น Line ID ที่ต้องการพิมพ์ Student ID หรือไม่
    if (studentData[lineId] && !studentData[lineId].studentId) {
      const studentId = messageText;

      // ตรวจสอบรหัสนักศึกษา (ตัวอย่าง: ตรวจสอบรูปแบบ BXXXXXXX)
      const studentIdPattern = /^B\d{7}$/;
      if (!studentIdPattern.test(studentId)) {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "รหัสนักศึกษาไม่ถูกต้อง กรุณาพิมพ์ใหม่อีกครั้ง",
        });
      }

      try {
        // ค้นหาในฐานข้อมูลว่ามี Student ID นี้อยู่หรือไม่
        const student = await Student.findOne({ where: { sid: studentId } });

        if (!student) {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: "ไม่พบรหัสนักศึกษานี้ในระบบ กรุณาลองใหม่อีกครั้ง",
          });
        }

        // บันทึกข้อมูลรหัสนักศึกษาใน studentData
        studentData[lineId].studentId = studentId;

        // อัปเดต Student ในฐานข้อมูลด้วย Line ID
        student.LineID = lineId;
        await student.save();

        // ส่งข้อความตอบกลับผู้ใช้ว่าเชื่อมต่อสำเร็จ
        const reply = {
          type: "text",
          text: `เชื่อมต่อ Line ID กับรหัสนักศึกษา ${studentId} สำเร็จแล้ว!`,
        };

        delete studentData[lineId]; // ลบข้อมูลชั่วคราวหลังใช้งานเสร็จ
        return client.replyMessage(event.replyToken, reply);
      } catch (error) {
        console.error("Error handling student data:", error);
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        });
      }
    }
  }

  return Promise.resolve(null); // ถ้าไม่ใช่ event ที่สนใจ ให้ข้ามไป
};

module.exports = { handleWebhook };
