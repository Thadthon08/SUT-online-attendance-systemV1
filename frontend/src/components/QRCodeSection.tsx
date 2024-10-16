import React from "react";
import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import { QrCode, RefreshCw } from "lucide-react";

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

  return (
    <Box
      sx={{
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "auto",
        boxShadow: 0,
        border: "0px solid rgba(69, 69, 71, 0.2)",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "red" }}>
        Countdown : {countdown}
      </Typography>

      {qrCodeData ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            p: 2,
          }}
        >
          <img
            src={qrCodeData}
            alt="QR Code"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: 500,
              display: "block",
              border: "1px solid rgba(69, 69, 71, 0.2)",
            }}
          />
          <Typography
            sx={{
              fontSize: "1rem",
              color: theme.palette.text.secondary,
              textAlign: "center",
              mt: 1,
            }}
          >
            สแกน QR Code นี้เพื่อเข้าร่วมห้อง
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 500,
            width: 500,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 0,
          }}
        >
          <QrCode size={64} color={theme.palette.primary.main} />
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={onReset}
        startIcon={<RefreshCw />}
        sx={{ m: 1, fontWeight: "bold" }}
      >
        สร้างห้องใหม่
      </Button>
    </Box>
  );
};

export default QRCodeSection;
