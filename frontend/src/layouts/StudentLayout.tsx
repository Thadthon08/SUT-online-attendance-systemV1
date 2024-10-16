import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect } from "react";

const StudentLayout = () => {
  useEffect(() => {
    const initializeLiff = async () => {
      const liff = (await import("@line/liff")).default;

      try {
        const liffId = "2006449283-GBkW3xMB";
        if (!liffId) {
          throw new Error("LIFF ID is not defined");
        }
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
        }
      } catch (error) {
        console.error(error);
      }
    };

    initializeLiff();
  });
  return (
    <>
      <Box>
        <Outlet />
      </Box>
    </>
  );
};

export default StudentLayout;
