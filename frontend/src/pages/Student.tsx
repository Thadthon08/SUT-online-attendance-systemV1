import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { showToast } from "../utils/toastUtils";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import { CheckCircle, Info, CameraAlt, Close } from "@mui/icons-material";
import {
  GetStudentIDByLineId,
  // UpdateProfileUrl,
  CheckIn,
} from "../services/api";
import { LocationMap } from "../components/LocationMap";
import { Html5Qrcode } from "html5-qrcode";

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false); // เพิ่มสถานะป้องกันการสแกนซ้ำ
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCode = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const liff = (await import("@line/liff")).default;
        await liff.ready;
        const profileData = await liff.getProfile();
        setProfile({
          userId: profileData.userId,
          displayName: profileData.displayName,
          pictureUrl: profileData.pictureUrl || "",
        });
        const student = await GetStudentIDByLineId(profileData.userId);
        // if (student && profileData.pictureUrl) {
        //   await UpdateProfileUrl(student.sid, {
        //     profilePicUrl: profileData.pictureUrl,
        //   });
        // }
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
              console.error("Error fetching location:", err);
              setError(
                "Failed to fetch location. Please enable location services."
              );
            }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      }
    };

    fetchProfile();
  }, []);

  const handleScan = async (decodedText: string) => {
    // ป้องกันการสแกนซ้ำถ้าเช็คชื่ออยู่
    if (isCheckingIn || !studentData || !currentLocation) return;

    setIsCheckingIn(true); // ตั้งสถานะเป็นกำลังเช็คชื่อ
    stopScan(); // หยุดการสแกนทันทีเพื่อป้องกันการเรียกซ้ำ

    if (decodedText) {
      setLoadingCheckIn(true);

      try {
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

        // เรียก API เช็คชื่อ
        await CheckIn(checkInData);

        // ถ้าเช็คชื่อสำเร็จ ใช้ toast แทน alert
        showToast("Check-in successful!", "success");
      } catch (error) {
        console.error("Error during check-in:", error);
        // ถ้าเกิดข้อผิดพลาดในการเช็คชื่อ ใช้ toast แทน alert
        showToast("Failed to check-in. Please try again.", "error");
      } finally {
        setLoadingCheckIn(false);
        setIsCheckingIn(false); // จบกระบวนการเช็คชื่อ
        // หากต้องการเริ่มสแกนใหม่ สามารถเรียก startScan() ที่นี่
        // startScan();
      }
    }
  };

  // ฟังก์ชันสำหรับเริ่มการสแกน
  const startScan = () => {
    if (scannerRef.current) {
      html5QrCode.current = new Html5Qrcode("reader");
      html5QrCode.current
        .start(
          { facingMode: "environment" }, // ใช้กล้องหลัง
          {
            fps: 30, // ความเร็วในการสแกน
            qrbox: { width: 250, height: 250 }, // ขนาดของกล่องสแกน
          },
          handleScan, // ฟังก์ชันที่จะเรียกเมื่อสแกนเจอ
          (errorMessage) => {
            console.error("QR Code scanning error:", errorMessage);
          }
        )
        .catch((err) => {
          console.error("Error starting QR Code scanner:", err);
        });
    }
  };

  // ฟังก์ชันสำหรับหยุดการสแกน
  const stopScan = () => {
    if (html5QrCode.current) {
      html5QrCode.current
        .stop()
        .then(() => {
          html5QrCode.current?.clear();
          setIsScanning(false); // ตั้งค่าสถานะการสแกนเป็น false
          html5QrCode.current = null; // ลบตัวแปรสแกนเนอร์ออก
        })
        .catch((err) => {
          console.error("Error stopping QR Code scanner:", err); // แสดงข้อผิดพลาดในการหยุดสแกน
        });
    }
  };

  useEffect(() => {
    if (isScanning) {
      startScan(); // เริ่มสแกนเมื่อ isScanning เป็น true
    }
    return () => {
      if (html5QrCode.current) {
        stopScan(); // หยุดสแกนเมื่อ component ถูก unmount
      }
    };
  }, [isScanning]);

  if (error)
    return (
      <Typography color="error" align="center" py={2}>
        {error}
      </Typography>
    );
  if (!profile || !studentData || !currentLocation)
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={profile.pictureUrl}
              alt={profile.displayName}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Box>
              <Typography variant="h5" component="div">
                {profile.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Student ID: {studentData.sid}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
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
            disabled={loadingCheckIn || isScanning}
          >
            {loadingCheckIn ? "Checking..." : "Check Attendance"}
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
        <Paper elevation={3} sx={{ mt: 3, p: 2, position: "relative" }}>
          <Typography variant="h6" gutterBottom align="center">
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
              border: "2px dashed #ccc",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
            }}
            ref={scannerRef}
          >
            <CameraAlt sx={{ fontSize: 48, color: "#999" }} />
            <Typography
              variant="body2"
              color="textSecondary"
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
      <ToastContainer />
    </Box>
  );
}
