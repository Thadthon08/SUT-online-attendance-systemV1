import { useState, useEffect } from "react";
import { Box, Paper, useMediaQuery, Container } from "@mui/material";
import { LocationMap } from "../components/LocationMap";
import { RoomForm } from "../components/RoomForm";
import { RoomInterface } from "../interface/IRoom";
import { CreateRoom } from "../services/api";
import { showToast } from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";
import QRCodeSection from "../components/QRCodeSection";
import TitleHeader from "../components/TitleHeader";

const Room = () => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 13.7563,
    lng: 100.5018,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [qrCodeData, setQrCodeData] = useState("");
  const [countdown, setCountdown] = useState(0);
  const isColumnLayout = useMediaQuery("(max-width:1472px)");

  document.title = "Create Room | Attendance System";

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

    try {
      const response = await CreateRoom(formattedData);

      if (response.message) {
        showToast("สร้างห้องสำเร็จ!", "success");
        setQrCodeData(response.qrCodeData);
        setCountdown(response.attendanceRoom.countdown_duration);
        setActiveStep(1);
      }
    } catch (error) {
      showToast("สร้างห้องไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        p: 4,
      }}
    >
      <TitleHeader
        Title="Room Management"
        Subtitle="Manage rooms for attendance and generate QR codes for students to check in."
      />
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1472,
          height: "auto",
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
          borderRadius: 1,
        }}
      >
        {activeStep === 0 && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: isColumnLayout ? "column" : "row",
            }}
          >
            <Box
              sx={{
                flex: isColumnLayout ? "0 0 400px" : 2,
                height: isColumnLayout ? "400px" : "75vh",
                zIndex: 0,
              }}
            >
              <LocationMap currentLocation={currentLocation} />
            </Box>
            <Box
              sx={{
                flex: 1,
                bgcolor: "brown.830",
                color: "common.white",
                p: 2,
                height: "auto",
              }}
            >
              <RoomForm onSubmit={onSubmit} />
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <QRCodeSection
            qrCodeData={qrCodeData}
            countdown={countdown}
            onReset={() => setActiveStep(0)}
          />
        )}
      </Paper>

      <ToastContainer />
    </Container>
  );
};

export default Room;
