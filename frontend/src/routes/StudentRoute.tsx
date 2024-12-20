import { useEffect, useState, lazy } from "react";
import { Verify } from "../services/api";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { isMobile } from "react-device-detect"; // เพิ่มการตรวจจับอุปกรณ์
import MobileAccessNotice from "../pages/MobileAccessNotice";

const StudentDashboard = lazy(() => import("../pages/Student"));
const StudentRegister = lazy(() => import("../pages/Register"));

const StudentRoute = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isMobile) {
      // ถ้าไม่ใช่มือถือ ให้บล็อกการเข้าถึงโดยตั้งค่า isVerified เป็น false
      setIsVerified(false);
      return;
    }

    const initializeLiff = async () => {
      try {
        const liff = (await import("@line/liff")).default;

        const liffId = "2006449283-GBkW3xMB";
        if (!liffId) throw new Error("LIFF ID is not defined");

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        const lineId = profile.userId;

        const verifyResponse = await Verify(lineId);
        setIsVerified(verifyResponse.status === "success");
      } catch (error) {
        console.error("Error verifying user:", error);
        setIsVerified(false);
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

  if (!isMobile) {
    return <MobileAccessNotice />;
  }

  return isVerified ? <StudentDashboard /> : <StudentRegister />;
};

export default StudentRoute;
