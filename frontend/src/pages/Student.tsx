import React, { useEffect, useState } from "react";
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
import { GetStudentIDByLineId, UpdateProfileUrl } from "../services/api";
import { LocationMap } from "../components/LocationMap";

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
            onClick={() => {
              /* Navigate to attendance check page */
            }}
            sx={{ height: "100%" }}
          >
            Check Attendance
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Info />}
            onClick={() => {
              /* Navigate to information display page */
            }}
            sx={{ height: "100%" }}
          >
            View Details
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
