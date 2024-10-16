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
} from "@mui/material";
import { CheckCircle, Info } from "@mui/icons-material";
import {
  GetStudentIDByLineId,
  UpdateProfileUrl,
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
        if (student && profileData.pictureUrl) {
          await UpdateProfileUrl(student.sid, {
            profilePicUrl: profileData.pictureUrl,
          });
        }
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
    if (decodedText && studentData && currentLocation) {
      try {
        setLoadingCheckIn(true);
        const ATR_id = new URLSearchParams(new URL(decodedText).search).get(
          "ATR_id"
        );

        if (ATR_id) {
          const checkInData = {
            ATR_id,
            sid: studentData.sid,
            att_lat: currentLocation.lat,
            att_long: currentLocation.lng,
          };

          await CheckIn(checkInData);
          alert("เช็คชื่อสำเร็จ!");
        }
      } catch (error) {
        console.error("Error during check-in:", error);
        alert("เกิดข้อผิดพลาดในการเช็คชื่อ.");
      } finally {
        setLoadingCheckIn(false);
      }
    }
  };

  useEffect(() => {
    if (scannerRef.current) {
      html5QrCode.current = new Html5Qrcode("reader"); // ใช้ `id="reader"` เพื่อแสดงกล้อง
      html5QrCode.current
        .start(
          { facingMode: "environment" }, // ใช้กล้องหลัง
          {
            fps: 10, // ความเร็วในการสแกน
            qrbox: { width: 250, height: 250 }, // ขนาดกรอบสแกน QR
          },
          handleScan, // ฟังก์ชันเมื่อสแกนสำเร็จ
          (errorMessage) => {
            console.error("QR Code scanning error:", errorMessage); // ข้อผิดพลาดในการสแกน
          }
        )
        .catch((err) => {
          console.error("Error starting QR Code scanner:", err);
        });

      // คืนค่ากล้องเมื่อ component ถูก unmount
      return () => {
        if (html5QrCode.current) {
          html5QrCode.current.stop().then(() => {
            html5QrCode.current?.clear();
          });
        }
      };
    }
  }, [scannerRef]);

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
            sx={{ height: "100%" }}
            disabled={loadingCheckIn}
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

      {/* แสดงกล้องสำหรับสแกน QR Code */}
      <Box
        id="reader"
        style={{ width: "100%", height: "300px", marginTop: "20px" }}
        ref={scannerRef}
      ></Box>
    </Box>
  );
}
