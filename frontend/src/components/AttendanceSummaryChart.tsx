import React, { useEffect, useState } from "react";
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
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { GetAttSumBtSid } from "../services/api";

interface AttendanceData {
  subjectCode: string;
  totalSessions: number;
  attendedSessions: number;
}

interface AttendanceSummaryChartProps {
  sid: string;
}

const AttendanceSummaryChart: React.FC<AttendanceSummaryChartProps> = ({
  sid,
}) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetAttSumBtSid(sid);
        if (result.error) {
          setError(result.error);
        } else {
          const formattedData = result.attendanceSummary.map(
            (subject: any) => ({
              subjectCode: subject.subjectCode,
              totalSessions: Number(subject.totalSessions),
              attendedSessions: Number(subject.attendedSessions),
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
    return <Typography color="error">{error}</Typography>;
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredData =
    selectedTab === 0 ? attendanceData : [attendanceData[selectedTab - 1]];

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "auto" }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="All Subjects" />
        {attendanceData.map((subject) => (
          <Tab key={subject.subjectCode} label={subject.subjectCode} />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subjectCode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="totalSessions"
              fill="#8884d8"
              name="จำนวนครั้งทั้งหมด"
            />
            <Bar
              dataKey="attendedSessions"
              fill="#82ca9d"
              name="จำนวนครั้งที่เข้าเรียน"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default AttendanceSummaryChart;
