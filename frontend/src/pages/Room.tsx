import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  useMediaQuery,
  Container,
  Typography,
} from "@mui/material";
import { LocationMap } from "../components/LocationMap";
import { RoomForm } from "../components/RoomForm";
import { RoomInterface } from "../interface/IRoom";
import { CreateRoom } from "../services/api";
import { showToast } from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";
import QRCodeSection from "../components/QRCodeSection";

const Room = () => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 13.7563,
    lng: 100.5018,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [qrCodeData, setQrCodeData] = useState("");
  const [countdown, setCountdown] = useState(0);
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        p: 4,
      }}
    >
      <Paper
        sx={{
          maxWidth: 1410,
          overflow: "hidden",
          boxShadow: 0,
          borderRadius: 0,
          border: "1px solid rgba(69, 69, 71, 0.2)",
          p: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={"bolder"}>
          Create Attendance Check
        </Typography>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1410,
          // height: isColumnLayout ? "auto" : "80vh",
          height: "auto",
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
          border: "1px solid rgba(69, 69, 71, 0.2)",
          borderRadius: 0,
        }}
      >
        {activeStep === 0 && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: isColumnLayout ? "column" : "row",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flex: isColumnLayout ? "0 0 400px" : 2,
                height: isColumnLayout ? "400px" : "80vh",
              }}
            >
              <LocationMap currentLocation={currentLocation} />
            </Box>
            <Box
              sx={{
                flex: 1,
                bgcolor: "grey.800",
                color: "common.white",
                p: 2,
                overflowY: "auto",
                maxHeight: isColumnLayout
                  ? "calc(100vh - 400px - 32px)"
                  : "100%",
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
