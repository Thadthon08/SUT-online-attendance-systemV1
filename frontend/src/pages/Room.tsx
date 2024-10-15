import { useState, useEffect } from "react";
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { LocationMap } from "../components/LocationMap";
import { RoomForm } from "../components/RoomForm";
import { RoomInterface } from "../interface/IRoom";
import { CreateRoom } from "../services/api";
import { showToast } from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";

const Room = () => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 13.7563,
    lng: 100.5018,
  });
  const isColumnLayout = useMediaQuery("(max-width:1410px)");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    } else {
      console.log("Geolocation is not supported by your browser");
    }
  }, []);

  const onSubmit = async (data: RoomInterface) => {
    const formattedData = {
      ...data,
      ATR_lat: currentLocation.lat,
      ATR_long: currentLocation.lng,
    };
    console.log("Form Data:", formattedData);

    try {
      const response = await CreateRoom(formattedData);

      if (response.message) {
        showToast("สร้างห้องสำเร็จ!", "success");
      }
    } catch (error) {
      showToast("สร้างห้องไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1410,
          height: isColumnLayout ? "auto" : "80vh",
          display: "flex",
          flexDirection: isColumnLayout ? "column" : "row",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: isColumnLayout ? "0 0 400px" : 2,
            height: isColumnLayout ? "400px" : "100%",
          }}
        >
          <LocationMap currentLocation={currentLocation} />
        </Box>
        <Box
          sx={{
            flex: 1,
            bgcolor: "primary.main",
            p: 2,
            overflowY: "auto",
            maxHeight: isColumnLayout ? "calc(100vh - 400px - 32px)" : "100%",
          }}
        >
          <RoomForm onSubmit={onSubmit} />
        </Box>
      </Paper>
      <ToastContainer />{" "}
    </Box>
  );
};

export default Room;
