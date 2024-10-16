import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
  const [student, setStudent] = useState<string | null>(null);

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
          try {
            const updatedProfile = await UpdateProfileUrl(student.sid, {
              profilePicUrl: profileData.pictureUrl,
            });
            console.log("Profile updated successfully:", updatedProfile);
          } catch (err) {
            console.error("Error updating profile:", err);
          }
        } else {
          console.warn("No student found or no picture URL available.");
        }

        setStudent(student);
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

  return (
    <Box>
      <Typography variant="h3">My Profile</Typography>
      {error ? (
        <div>{error}</div>
      ) : profile ? (
        <>
          <div>User Id: {profile.userId}</div>
          <div>Display Name: {profile.displayName}</div>
          <div>Status: {profile.statusMessage}</div>
          {profile.pictureUrl && (
            <img
              src={profile.pictureUrl}
              alt="profile"
              height={100}
              width={100}
            />
          )}
          {student && <div>Student ID: {student}</div>}
        </>
      ) : (
        <div>Loading profile...</div>
      )}

      <Typography variant="h4">My Location</Typography>
      {locationError ? (
        <div>{locationError}</div>
      ) : lat && long ? (
        <>
          <div>Latitude: {lat}</div>
          <div>Longitude: {long}</div>
        </>
      ) : (
        <div>Loading location...</div>
      )}
    </Box>
  );
}
