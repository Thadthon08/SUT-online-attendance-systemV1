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
  Alert,
  CircularProgress,
  TableContainer,
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
    let pollingTimeout: NodeJS.Timeout;

    const longPolling = async () => {
      await fetchAttendance();
      pollingTimeout = setTimeout(longPolling, 15000);
    };

    longPolling();

    return () => {
      clearTimeout(pollingTimeout);
    };
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
      {/* Header */}
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

      {attendanceData && attendanceData.totalCheckedIn === 0 ? (
        <Typography
          sx={{ py: 10 }}
          variant="h3"
          fontWeight="normal"
          color="text.secondary"
          align="center"
        >
          ไม่มีข้อมูลการเข้าร่วมในห้องเรียน
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Check-in Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData?.students.map((student: any) => (
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
        </TableContainer>
      )}
    </Container>
  );
}
