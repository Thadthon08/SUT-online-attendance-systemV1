import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { CheckCircle, Info, CameraAlt, Close } from "@mui/icons-material";
import { GetStudentIDByLineId, CheckIn } from "../services/api";
import { LocationMap } from "../components/LocationMap";
import { Html5Qrcode } from "html5-qrcode";
import { useProfile } from "../utils/useProfile";

// สร้างธีม Dark
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#f48fb1" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
});

export default function StudentDashboard() {
  const { profile, isLoading } = useProfile();
  const [studentData, setStudentData] = useState<any | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const lastDecodedText = useRef<string | null>(null);

  useEffect(() => {
    if (profile) {
      const fetchStudentData = async () => {
        try {
          const student = await GetStudentIDByLineId(profile.userId);
          setStudentData(student);

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setCurrentLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              },
              (err) => {
                console.error("Failed to fetch location:", err);
                Swal.fire({
                  title: "Location Error",
                  text: "Failed to fetch location. Please enable location services.",
                  icon: "error",
                  confirmButtonText: "OK",
                  background: "#1e1e1e",
                  color: "#ffffff",
                });
              }
            );
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to load student data.",
            icon: "error",
            confirmButtonText: "OK",
            background: "#1e1e1e",
            color: "#ffffff",
          });
        }
      };
      fetchStudentData();
    }
  }, [profile]);

  const handleScan = async (decodedText: string) => {
    if (isCheckingIn || !studentData || !currentLocation) return;

    if (lastDecodedText.current === decodedText) return;

    lastDecodedText.current = decodedText;
    setIsCheckingIn(true);
    stopScan();

    try {
      let ATR_id = decodedText;

      // ตรวจสอบว่า ATR_id มาจาก URL หรือไม่
      try {
        const url = new URL(decodedText);
        ATR_id = new URLSearchParams(url.search).get("ATR_id") || decodedText;
      } catch {
        console.warn("Not a valid URL, using raw decoded text as ATR_id");
      }

      const checkInData = {
        ATR_id,
        sid: studentData.sid,
        att_lat: currentLocation.lat,
        att_long: currentLocation.lng,
      };

      await CheckIn(checkInData);

      Swal.fire({
        title: "Success!",
        text: "Check-in successful!",
        icon: "success",
        confirmButtonText: "OK",
        background: "#1e1e1e",
        color: "#ffffff",
      });
    } catch (error) {
      Swal.fire({
        title: "Check-in Failed",
        text: "Failed to check-in. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1e1e1e",
        color: "#ffffff",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const startScan = () => {
    if (scannerRef.current) {
      html5QrCode.current = new Html5Qrcode("reader");
      html5QrCode.current
        .start(
          { facingMode: "environment" },
          { fps: 30, qrbox: { width: 250, height: 250 } },
          handleScan,
          (errorMessage) =>
            console.error("QR Code scanning error:", errorMessage)
        )
        .catch((err) => {
          console.log("Failed to start QR code scanner:", err);

          Swal.fire({
            title: "Scanner Error",
            text: "Failed to start the QR code scanner. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
            background: "#1e1e1e",
            color: "#ffffff",
          });
        });
    }
  };

  const stopScan = () => {
    if (html5QrCode.current) {
      html5QrCode.current.stop().then(() => {
        html5QrCode.current?.clear();
        setIsScanning(false);
        html5QrCode.current = null;
      });
    }
  };

  useEffect(() => {
    if (isScanning) {
      startScan();
    }
    return stopScan; // หยุดการสแกนเมื่อคอมโพเนนต์ถูก unmount
  }, [isScanning]);

  if (isLoading || !profile || !studentData || !currentLocation) return null;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
        <Card elevation={3} sx={{ mb: 3, backgroundColor: "background.paper" }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={profile.pictureUrl}
                alt={profile.displayName}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h5" color="text.primary">
                  {profile.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Student ID: {studentData.sid}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" color="text.primary">
              Current Location
            </Typography>
            <Box sx={{ height: 200, width: "100%", mb: 2 }}>
              <LocationMap currentLocation={currentLocation} />
            </Box>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CheckCircle />}
              onClick={() => setIsScanning(true)}
              sx={{ height: "100%" }}
              disabled={isScanning}
            >
              Check Attendance
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Info />}
              sx={{ height: "100%" }}
            >
              View Details
            </Button>
          </Grid>
        </Grid>
        {isScanning && (
          <Paper
            elevation={3}
            sx={{
              mt: 3,
              p: 2,
              position: "relative",
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="h6" align="center" color="text.primary">
              Scan QR Code
            </Typography>
            <Box
              id="reader"
              sx={{
                width: "100%",
                height: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px dashed #555",
                borderRadius: 2,
              }}
              ref={scannerRef}
            >
              <CameraAlt sx={{ fontSize: 48, color: "#777" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: "center" }}
              >
                Position the QR code within the frame to scan
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Close />}
              onClick={stopScan}
              sx={{ mt: 2, width: "100%" }}
            >
              Stop Scanning
            </Button>
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
}
