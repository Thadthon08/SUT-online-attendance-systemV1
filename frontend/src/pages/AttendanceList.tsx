import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Grid,
  alpha,
} from "@mui/material";
import { GetAttendanceForRoom } from "../services/api";
import * as XLSX from "xlsx";
import theme from "../config/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function ViewAttendees() {
  const { id } = useParams<{ id: string }>();
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAttendance = useCallback(async () => {
    if (!id) {
      setError("Invalid room ID.");
      setLoading(false);
      return;
    }

    try {
      const data = await GetAttendanceForRoom(id);

      if (data.students && data.students.length > 0) {
        setAttendanceData(data);
        setError(null);
      } else {
        setError("ไม่พบข้อมูลการเข้าร่วมในห้องเรียนนี้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const longPolling = async () => {
      await fetchAttendance();
      setTimeout(longPolling, 5000);
    };

    longPolling();

    return () => {};
  }, [fetchAttendance]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExport = () => {
    if (!attendanceData || !attendanceData.students) {
      alert("No data available to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(
      attendanceData.students.map((student: any) => ({
        Student_ID: student.sid,
        Name: student.name,
        Check_in_Time: new Date(student.checkInTime).toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendees");

    XLSX.writeFile(wb, `attendees_room_${id}.xlsx`);
  };

  if (loading && !attendanceData) {
    return <Typography>Loading attendees data...</Typography>;
  }

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        p: 4,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          maxWidth: 1472,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: 0,
          p: 2,
          mb: 3,
        }}
      >
        <Grid item>
          <Typography variant="h5" fontWeight="bolder">
            View Attendees List
          </Typography>
          <Typography variant="subtitle2">
            All aspects related to the app users can be managed from this page.
          </Typography>
        </Grid>

        <Grid item>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Typography variant="h2" fontWeight="bolder" align="center">
                {attendanceData ? attendanceData.totalCheckedIn : 0}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" align="center">
                Total Checked In
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleBack}
          sx={{ borderRadius: 1, mr: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleExport}
          sx={{ borderRadius: 1 }}
          startIcon={<FileDownloadIcon />}
        >
          Export to Excel
        </Button>
      </Grid>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Check-in Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              attendanceData?.students.map((student: any) => (
                <TableRow key={student.sid}>
                  <TableCell>{student.sid}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {new Date(student.checkInTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
