import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Paper,
  Fade,
  Stack,
  alpha,
} from "@mui/material";
import { RefreshCw, Download } from "lucide-react";

interface QRCodeSectionProps {
  qrCodeData: string;
  countdown: number;
  onReset: () => void;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  qrCodeData,
  countdown,
  onReset,
}) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(countdown * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeData;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        borderRadius: 0,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color:
            timeLeft > 0
              ? theme.palette.error.main
              : theme.palette.text.primary,
          mb: 4,
        }}
      >
        Countdown: {formatTime(timeLeft)}
      </Typography>

      <Fade in={!!qrCodeData}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            mb: 4,
          }}
        >
          <Paper
            elevation={5}
            sx={{
              p: 2,
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <img
              src={qrCodeData}
              alt="QR Code"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: 600,
                maxHeight: 600,
                display: "block",
              }}
            />
          </Paper>
          <Typography
            variant="h6"
            fontWeight={"bold"}
            sx={{
              color: theme.palette.text.secondary,
              textAlign: "center",
              mt: 2,
            }}
          >
            สแกน QR Code นี้เพื่อเข้าร่วมห้อง
          </Typography>
        </Box>
      </Fade>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={onReset}
          startIcon={<RefreshCw />}
          size="large"
          sx={{
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
              boxShadow: 5,
            },
          }}
        >
          สร้างห้องใหม่
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleDownload}
          startIcon={<Download />}
          size="large"
          sx={{
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 3,
            "&:hover": {
              bgcolor: theme.palette.primary.light,
              boxShadow: 5,
            },
          }}
        >
          ดาวน์โหลด QR Code
        </Button>
      </Stack>
    </Paper>
  );
};

export default QRCodeSection;
