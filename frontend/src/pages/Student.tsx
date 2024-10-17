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
} from "@mui/material";
import { CheckCircle, Info, CameraAlt, Close } from "@mui/icons-material";
import { GetStudentIDByLineId, CheckIn } from "../services/api";
import { LocationMap } from "../components/LocationMap";
import { Html5Qrcode } from "html5-qrcode";

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        Swal.fire({
          title: "Loading...",
          text: "Please wait while we fetch your profile",
          icon: "info",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        const liff = (await import("@line/liff")).default;
        await liff.ready;
        const profileData = await liff.getProfile();
        setProfile({
          userId: profileData.userId,
          displayName: profileData.displayName,
          pictureUrl: profileData.pictureUrl || "",
        });
        const student = await GetStudentIDByLineId(profileData.userId);
        setStudentData(student);

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
              });
            }
          );
        } else {
          Swal.fire({
            title: "Geolocation Unsupported",
            text: "Geolocation is not supported by this browser.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        Swal.fire({
          title: "Profile Error",
          text: "Failed to load profile. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchProfile();
  }, []);

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
        });
      } catch (error) {
        console.error("Error during check-in:", error);
        Swal.fire({
          title: "Check-in Failed",
          text: "Failed to check-in. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
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
    </Box>
  );
}
