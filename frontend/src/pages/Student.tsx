import { useEffect, useState, useRef } from "react";
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
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { CheckCircle, Info, Close } from "@mui/icons-material";
import {
  GetStudentIDByLineId,
  UpdateProfileUrl,
  CheckIn,
} from "../services/api"; // CheckIn สำหรับ POST ไปเช็คชื่อ
import { LocationMap } from "../components/LocationMap";
import { Html5Qrcode } from "html5-qrcode"; // ใช้ Html5Qrcode โดยตรง

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
  const [isScannerOpen, setIsScannerOpen] = useState(false); // สถานะเปิด/ปิดกล้อง
  const [loadingCheckIn, setLoadingCheckIn] = useState(false); // สถานะการเช็คชื่อ
  const scannerRef = useRef<HTMLDivElement | null>(null); // ใช้ ref เก็บ element ของกล้อง

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
        if (student && profileData.pictureUrl) {
          await UpdateProfileUrl(student.sid, {
            profilePicUrl: profileData.pictureUrl,
          });
        }
        setStudentData(student);

        // Get current location
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

  const handleScan = async (data: string) => {
    if (data && studentData && currentLocation) {
      try {
        setLoadingCheckIn(true);
        const ATR_id = new URLSearchParams(new URL(data).search).get("ATR_id");

        if (ATR_id) {
          const checkInData = {
            ATR_id,
            sid: studentData.sid,
            att_lat: currentLocation.lat,
            att_long: currentLocation.lng,
          };

          // ส่งข้อมูลไปเช็คชื่อ
          await CheckIn(checkInData);

          alert("เช็คชื่อสำเร็จ!");
        }
      } catch (error) {
        console.error("Error during check-in:", error);
        alert("เกิดข้อผิดพลาดในการเช็คชื่อ.");
      } finally {
        setLoadingCheckIn(false);
        setIsScannerOpen(false); // ปิด popup สแกนเมื่อเช็คชื่อเสร็จ
      }
    }
  };

  // เริ่มต้นกล้องสแกน
  useEffect(() => {
    if (isScannerOpen && scannerRef.current) {
      const html5QrCode = new Html5Qrcode("reader"); // ใช้ id `reader`

      // เริ่มการสแกน QR Code
      html5QrCode
        .start(
          { facingMode: "environment" }, // เปิดกล้องหลัง
          {
            fps: 10, // ความเร็วการสแกน
            qrbox: { width: 250, height: 250 }, // ขนาดกรอบสแกน
          },
          (decodedText) => {
            handleScan(decodedText); // เรียกเมื่อสแกนสำเร็จ
          },
          (errorMessage) => {
            console.error("QR Code scanning error:", errorMessage);
          }
        )
        .catch((err) => {
          console.error("Error starting QR Code scanner:", err);
        });

      // คืนค่ากล้องเมื่อ popup ถูกปิด
      return () => {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        });
      };
    }
  }, [isScannerOpen]);

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
            onClick={() => setIsScannerOpen(true)} // เปิด popup สแกน
            sx={{ height: "100%" }}
            disabled={loadingCheckIn} // ปิดปุ่มถ้าเช็คชื่ออยู่
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

      {/* Popup สำหรับสแกน QR Code */}
      <Dialog
        open={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">สแกน QR Code</Typography>
            <IconButton onClick={() => setIsScannerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Box id="reader" style={{ width: "100%" }} ref={scannerRef}></Box>{" "}
          {/* กล้องสแกน */}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
