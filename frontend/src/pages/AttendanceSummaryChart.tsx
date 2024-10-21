import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GetAttSumBtSid } from "../services/api";

const AttendanceSummaryChart = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const sid = "B6405526";
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetAttSumBtSid(sid); // เรียกใช้ service function
        if (result.error) {
          setError(result.error);
        } else {
          // จัดการข้อมูลให้อยู่ในรูปแบบที่ใช้กับ Recharts
          const formattedData = result.attendanceSummary.map(
            (subject: any) => ({
              subjectName: subject.subjectName,
              totalSessions: subject.totalSessions,
              attendedSessions: subject.attendedSessions,
            })
          );
          setAttendanceData(formattedData);
        }
      } catch (err) {
        setError("Error fetching data.");
      }
    };

    fetchData();
  }, [sid]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={attendanceData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subjectName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSessions" fill="#8884d8" name="จำนวนครั้งทั้งหมด" />
        <Bar
          dataKey="attendedSessions"
          fill="#82ca9d"
          name="จำนวนครั้งที่เข้าเรียน"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceSummaryChart;
