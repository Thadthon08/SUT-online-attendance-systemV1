import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { CheckCircle, CameraAlt, Close } from "@mui/icons-material";
import { GetStudentIDByLineId, CheckIn } from "../services/api";
import { LocationMap } from "../components/LocationMap";
import { Html5Qrcode } from "html5-qrcode";
import { useProfile } from "../utils/useProfile";
import { StudentInterface } from "../interface/IStudent";

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
  const [studentData, setStudentData] = useState<StudentInterface | null>(null);

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

          if (!navigator.geolocation) {
            throw new Error("Geolocation is not supported by this browser.");
          }

          const geolocationOptions = {
            timeout: 20000,
            maximumAge: 0,
            enableHighAccuracy: true,
          };

          const getLocation = () => {
            return new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                geolocationOptions
              );
            });
          };

          const timeout = new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Geolocation timed out")),
              geolocationOptions.timeout
            )
          );

          const position = await Promise.race([getLocation(), timeout]);

          const geoPosition = position as GeolocationPosition;

          setCurrentLocation({
            lat: geoPosition.coords.latitude,
            lng: geoPosition.coords.longitude,
          });
        } catch (error) {
          console.error("Error fetching student data or location:", error);

          Swal.fire({
            title: "Error fetching location",
            text: "กรุณาเปิดการใช้งานตำแหน่งที่ตั้งและลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "ตกลง",
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

    setIsCheckingIn(true);
    stopScan();

    try {
      let ATR_id = decodedText;

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

      lastDecodedText.current = decodedText;

      Swal.fire({
        title: "สำเร็จ!",
        text: "เช็คชื่อสำเร็จ!",
        icon: "success",
        confirmButtonText: "ตกลง",
        background: "#1e1e1e",
        color: "#ffffff",
      });
    } catch (error: any) {
      let errorMessage = "เกิดข้อผิดพลาดในการเช็คชื่อ กรุณาลองใหม่อีกครั้ง";

      if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: "เช็คชื่อไม่สำเร็จ",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ตกลง",
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
          { fps: 30, qrbox: { width: 280, height: 280 } },
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
    return stopScan;
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
        <Button
          variant="contained"
          fullWidth
          startIcon={<CheckCircle />}
          onClick={() => setIsScanning(true)}
          sx={{ height: "100%", p: 2 }}
          disabled={isScanning}
        >
          Check Attendance
        </Button>

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
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              color="text.primary"
            >
              Scan QR Code
            </Typography>
            <Box
              id="reader"
              sx={{
                width: "100%",
                height: 300,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "2px dashed #555",
                borderRadius: 2,
                position: "relative",
                overflow: "hidden",
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
              sx={{ mt: 2, width: "100%", p: 2 }}
            >
              Stop Scanning
            </Button>
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
}
