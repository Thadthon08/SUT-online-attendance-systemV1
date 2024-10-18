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
import { GetStudentIDByLineId, CheckIn, Verify } from "../services/api";
import { LocationMap } from "../components/LocationMap";
import { Html5Qrcode } from "html5-qrcode";

// สร้างธีม Dark
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const [os, setOs] = useState("ios") as any;
  const [friendFlag, setFriendFlag] = useState() as any;
  const [code, setCode] = useState() as any;

  document.title = "Student Dashboard | Attendance System";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        Swal.fire({
          title: "Loading...",
          text: "Please wait while we fetch your profile",
          icon: "info",
          allowOutsideClick: false,
          showConfirmButton: false,
          background: "#1e1e1e",
          color: "#ffffff",
          willOpen: () => {
            Swal.showLoading();
          },
        });

        const liff = (await import("@line/liff")).default;
        await liff.ready;
        const checkOs = liff.getOS();
        setOs(checkOs);
        console.log(os);
        liff.getFriendship().then((data) => {
          console.log("friendFlag: ", data);
          if (data.friendFlag) {
            setFriendFlag(data.friendFlag);
          }
          console.log("friendFlag: ", friendFlag);
        });

        const profileData = await liff.getProfile();
        setProfile({
          userId: profileData.userId,
          displayName: profileData.displayName,
          pictureUrl: profileData.pictureUrl || "",
        });

        // เรียก Verify API
        const verify = await Verify(profileData.userId);
        if (verify.status === "fail") {
          // ถ้าสถานะเป็น fail ให้เปลี่ยนเส้นทางไปที่ /student/register
          console.log("Redirect to /student/register");

          return;
        }

        // ถ้า Verify ผ่าน ให้ดึงข้อมูลนักศึกษา
        const student = await GetStudentIDByLineId(profileData.userId);
        setStudentData(student);

        // เรียกตำแหน่งที่ตั้งปัจจุบัน
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              Swal.close();
            },
            (err) => {
              console.error("Error fetching location:", err);
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
        } else {
          Swal.fire({
            title: "Geolocation Unsupported",
            text: "Geolocation is not supported by this browser.",
            icon: "error",
            confirmButtonText: "OK",
            background: "#1e1e1e",
            color: "#ffffff",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        Swal.fire({
          title: "Profile Error",
          text: "Failed to load profile. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#1e1e1e",
          color: "#ffffff",
        });
      }
    };

    fetchProfile();
  }, []);

  const scanCode = async () => {
    const liff = (await import("@line/liff")).default;

    if (liff.isInClient() && liff.getOS() === "android") {
      if (liff.scanCode) {
        const result = await liff.scanCode();
        setCode(result.value);
      } else {
        console.error("liff.scanCode is not available");
        Swal.fire({
          title: "Error",
          text: "QR code scanning is not supported on this device.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#1e1e1e",
          color: "#ffffff",
        });
      }
    } else {
      alert("Not support");
    }
  };

  const handleScan = async (decodedText: string) => {
    if (isCheckingIn || !studentData || !currentLocation) return;

    setIsCheckingIn(true);
    stopScan();

    if (decodedText) {
      try {
        Swal.fire({
          title: "Checking In...",
          text: "Please wait while we process your check-in",
          icon: "info",
          allowOutsideClick: false,
          showConfirmButton: false,
          background: "#1e1e1e",
          color: "#ffffff",
          willOpen: () => {
            Swal.showLoading();
          },
        });

        let ATR_id = decodedText;

        try {
          const url = new URL(decodedText);
          ATR_id = new URLSearchParams(url.search).get("ATR_id") || decodedText;
        } catch (error) {
          console.warn("Not a valid URL, using raw decoded text as ATR_id");
        }

        const checkInData = {
          ATR_id,
          sid: studentData.sid,
          att_lat: currentLocation.lat,
          att_long: currentLocation.lng,
        };

        console.log("CheckIn Data:", checkInData);

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
        console.error("Error during check-in:", error);
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
    }
  };

  const startScan = () => {
    if (scannerRef.current) {
      html5QrCode.current = new Html5Qrcode("reader");
      html5QrCode.current
        .start(
          { facingMode: "environment" },
          {
            fps: 30,
            qrbox: { width: 250, height: 250 },
          },
          handleScan,
          (errorMessage) => {
            console.error("QR Code scanning error:", errorMessage);
          }
        )
        .catch((err) => {
          console.error("Error starting QR Code scanner:", err);
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
      html5QrCode.current
        .stop()
        .then(() => {
          html5QrCode.current?.clear();
          setIsScanning(false);
          html5QrCode.current = null;
        })
        .catch((err) => {
          console.error("Error stopping QR Code scanner:", err);
        });
    }
  };

  useEffect(() => {
    if (isScanning) {
      startScan();
    }
    return () => {
      if (html5QrCode.current) {
        stopScan();
      }
    };
  }, [isScanning]);

  if (!profile || !studentData || !currentLocation) return null;

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
                <Typography variant="h5" component="div" color="text.primary">
                  {profile.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Student ID: {studentData.sid}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom color="text.primary">
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
              onClick={() => {
                scanCode();
                console.log("code: ", code);
              }}
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
