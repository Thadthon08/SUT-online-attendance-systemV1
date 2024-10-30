import { Box, Card, Typography, Container } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { keyframes } from "@emotion/react";

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const MobileAccessNotice = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(-45deg, #ff7f7f, #7fcdcd, #ff9b9b, #91d5d5)",
        backgroundSize: "400% 400%",
        animation: `${gradientShift} 15s ease infinite`,
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            padding: 4,
            backdropFilter: "blur(10px)",
            animation: `${fadeIn} 1s ease-out`,
            position: "relative",
            overflow: "visible",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: "-2px",
              background: "linear-gradient(45deg, #ff7f7f, #7fcdcd)",
              borderRadius: "inherit",
              zIndex: -1,
              opacity: 0.5,
              animation: `${pulse} 2s ease-in-out infinite`,
            },
          }}
        >
          {/* Decorative Elements */}
          {[...Array(3)].map((_, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                width: "10px",
                height: "10px",
                background: "linear-gradient(45deg, #ff7f7f, #7fcdcd)",
                borderRadius: "50%",
                top: `${20 + index * 30}%`,
                left: `-${20 + index * 10}px`,
                opacity: 0.6,
                animation: `${float} ${2 + index}s ease-in-out infinite`,
              }}
            />
          ))}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              position: "relative",
            }}
          >
            <Box
              sx={{
                animation: `${float} 3s ease-in-out infinite`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PhoneIphoneIcon
                sx={{
                  fontSize: 88,
                  background: "linear-gradient(45deg, #ff7f7f, #7fcdcd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #ff7f7f, #7fcdcd)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                animation: `${gradientShift} 3s ease infinite`,
              }}
            >
              Mobile Access Only
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(0, 0, 0, 0.6)",
                textAlign: "center",
                fontWeight: 500,
                opacity: 0,
                animation: `${fadeIn} 1s ease-out forwards`,
                animationDelay: "0.5s",
              }}
            >
              ท่านสามารถเข้าใช้ระบบได้ด้วย Smart Phone เท่านั้น
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default MobileAccessNotice;
