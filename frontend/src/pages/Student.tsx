import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Profile {
  userId: string;
  displayName: string;
  statusMessage?: string;
  pictureUrl?: string;
}

export default function Student() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      }
    };

    fetchProfile();
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
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Box>
  );
}
