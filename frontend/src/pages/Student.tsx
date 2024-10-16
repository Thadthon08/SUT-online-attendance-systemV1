import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import { PersonOutline, LocationOn, School } from "@mui/icons-material";
import { GetStudentIDByLineId, UpdateProfileUrl } from "../services/api";

interface Profile {
  userId: string;
  displayName: string;
  statusMessage?: string;
  pictureUrl?: string;
}

export default function Student() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [long, setLong] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const liff = (await import("@line/liff")).default;
        await liff.ready;
        const profileData = await liff.getProfile();
        setProfile({
          userId: profileData.userId,
          displayName: profileData.displayName,
          statusMessage: profileData.statusMessage || "",
          pictureUrl: profileData.pictureUrl || "",
        });
        const student = await GetStudentIDByLineId(profileData.userId);
        if (student && profileData.pictureUrl) {
          await UpdateProfileUrl(student.sid, {
            profilePicUrl: profileData.pictureUrl,
          });
        }
        setStudentData(student);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      }
    };

    fetchProfile();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        (err) => {
          console.error("Error fetching location:", err);
          setLocationError(
            "Failed to fetch location. Please enable location services."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  if (error)
    return (
      <Typography color="error" align="center" py={2}>
        {error}
      </Typography>
    );
  if (!profile)
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <Card elevation={3} sx={{ mb: 2 }}>
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
                {profile.statusMessage}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List disablePadding>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonOutline />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="User ID" secondary={profile.userId} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocationOn />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Location"
                secondary={
                  locationError
                    ? locationError
                    : lat && long
                    ? `${lat.toFixed(4)}, ${long.toFixed(4)}`
                    : "Loading location..."
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <School sx={{ verticalAlign: "middle", mr: 1 }} />
            Student Data
          </Typography>
          {studentData ? (
            <Paper
              elevation={0}
              sx={{
                bgcolor: "grey.100",
                p: 2,
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {JSON.stringify(studentData, null, 2)}
              </pre>
            </Paper>
          ) : (
            <Typography>Loading student data...</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
