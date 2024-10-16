import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Student() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const liff = (await import("@line/liff")).default;
      await liff.ready;
      const profile = await liff.getProfile();
      console.log(profile);

      setProfile(profile);
    };

    fetchProfile();
  }, []);
  return (
    <Box>
      <Typography variant="h3">My Profile</Typography>
      <h1>Profile</h1>
      <div>Data: {JSON.stringify(profile)}</div>
      {/* <div>User Id: {profile.userId}</div>
      <div>Display Name: {profile.displayName}</div>
      <div>Status: {profile.statusMessage}</div>
      <div>{profile.pictureUrl}</div> */}
    </Box>
  );
}
