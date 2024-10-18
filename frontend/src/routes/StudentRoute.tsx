import { useEffect, useState } from "react";
import { Verify } from "../services/api";
import StudentDashboard from "../pages/Student";
import StudentRegister from "../pages/Register";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const StudentRoute = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLiff = async () => {
      const liff = (await import("@line/liff")).default;

      try {
        const liffId = "2006449283-GBkW3xMB";
        if (!liffId) throw new Error("LIFF ID is not defined");

        await liff.init({ liffId });
        if (!liff.isLoggedIn()) liff.login();

        const profile = await liff.getProfile();
        const lineId = profile.userId;

        const verifyResponse = await Verify(lineId);

        if (verifyResponse.status === "success") {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ถ้า isVerified === true แสดงหน้า Dashboard
  // ถ้า isVerified === false แสดงหน้า Register
  return isVerified ? <StudentDashboard /> : <StudentRegister />;
};

export default StudentRoute;
