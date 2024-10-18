import { useEffect, useState } from "react";
import { Verify } from "../services/api";
import StudentDashboard from "../pages/Student";
import StudentRegister from "../pages/Register";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const StudentRoute = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null); // null = loading, true/false = verified status

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liff = (await import("@line/liff")).default;

        const liffId = "2006449283-GBkW3xMB";
        if (!liffId) throw new Error("LIFF ID is not defined");

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
          return; // หลังจาก login จะ reload page
        }

        const profile = await liff.getProfile();
        const lineId = profile.userId;

        const verifyResponse = await Verify(lineId);
        setIsVerified(verifyResponse.status === "success");
      } catch (error) {
        console.error("Error verifying user:", error);
        setIsVerified(false); // ให้ถือว่า verify ล้มเหลวเมื่อเกิด error
      }
    };

    initializeLiff();
  }, []);

  if (isVerified === null) {
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

  // ถ้า isVerified === true แสดงหน้า Dashboard, ถ้า false แสดงหน้า Register
  return isVerified ? <StudentDashboard /> : <StudentRegister />;
};

export default StudentRoute;
