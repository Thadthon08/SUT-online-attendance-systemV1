import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import AppHeader from "../components/AppHeader";
import SideNav from "../components/SideNav";
import { UserData } from "../interface/Signinrespone";

const BackendLayout: React.FC = () => {
  const theme = useTheme();
  const data = localStorage.getItem("data");
  const [parsedData, setParsedData] = useState<UserData | undefined>(undefined);

  useEffect(() => {
    if (data) {
      setParsedData(JSON.parse(data));
    }
  }, [data]);

  return (
    <>
      <CssBaseline />
      <AppHeader Data={parsedData} />
      <Box sx={styles.container(theme)}>
        <SideNav Data={parsedData} />
        <Box component="main" sx={styles.mainSection(theme)}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

const styles = {
  container: (theme: any) => ({
    display: "flex",
    bgcolor: theme.palette.background.default,
  }),
  mainSection: (theme: any) => ({
    px: 4,
    py: 1,
    width: "100%",
    height: "100%",
    overflow: "auto",
    bgcolor: theme.palette.background.default,
    color: theme.palette.text.primary,
  }),
};

export default BackendLayout;
