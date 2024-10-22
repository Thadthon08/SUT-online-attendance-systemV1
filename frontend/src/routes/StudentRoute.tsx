import { useEffect, useState, Suspense, lazy } from "react";
import { Verify } from "../services/api";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const StudentDashboard = lazy(() => import("../pages/Student"));
const StudentRegister = lazy(() => import("../pages/Register"));

const StudentRoute = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
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

  return isVerified ? <StudentDashboard /> : <StudentRegister />;
};

export default StudentRoute;
