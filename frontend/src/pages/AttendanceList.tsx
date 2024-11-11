import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Grid,
  alpha,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { GetAttendanceForRoom } from "../services/api";
import * as XLSX from "xlsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { showToast } from "../utils/toastUtils";

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
      setLoading(true);
      const data = await GetAttendanceForRoom(id);
      setAttendanceData(data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleExport = () => {
    if (
      !attendanceData ||
      !attendanceData.students ||
      attendanceData.students.length === 0
    ) {
      showToast("No data available to export", "error");
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

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading attendees data...</Typography>
      </Container>
    );
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
          width: "100%",
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: `1px solid ${alpha("#E2E8F0", 0.8)}`, // Slate 200 with opacity
          mb: 3,
          p: 3,
        }}
      >
        <Grid item>
          <Typography variant="h5" fontWeight="bolder">
            View Attendees List
          </Typography>
          <Typography variant="subtitle2">
            Browse the list of students who have checked in for each room.
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
                {attendanceData?.totalCheckedIn ?? 0}
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
          sx={{
            borderRadius: 1,
            bgcolor: "#4cd963",
            "&:hover": {
              bgcolor: "#3bb350",
            },
          }}
          startIcon={<FileDownloadIcon />}
          disabled={!attendanceData || attendanceData.totalCheckedIn === 0}
        >
          Export to Excel
        </Button>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {attendanceData?.students && attendanceData.students.length > 0 ? (
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
              {attendanceData.students.map((student: any) => (
                <TableRow key={student.sid}>
                  <TableCell>{student.sid}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {new Date(student.checkInTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Typography
          sx={{ py: 10 }}
          variant="h3"
          fontWeight="normal"
          color="text.secondary"
          align="center"
        >
          ไม่มีข้อมูลการเข้าร่วมในห้องเรียน
        </Typography>
      )}
    </Container>
  );
}
