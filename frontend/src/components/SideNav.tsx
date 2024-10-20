import React, { useState } from "react";
import {
  Avatar,
  Box,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { Link } from "react-router-dom";
import { UserData } from "../interface/Signinrespone";

interface SideNavProps {
  Data?: UserData;
}

const SideNav: React.FC<SideNavProps> = ({ Data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { collapsed, toggleSidebar } = useProSidebar();
  const [activeMenu, setActiveMenu] = useState("/dashboard");

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    toggleSidebar();
  };

  return (
    <Sidebar
      style={{
        height: isMobile ? "100vh" : "auto",
        top: "auto",
        minHeight: "100vh",
      }}
      breakPoint="md"
      backgroundColor={theme.palette.background.paper}
    >
      <Box sx={styles.avatarContainer}>
        <Avatar sx={styles.avatar} alt="Samit" src={Data?.profile_pic} />
        {!collapsed && (
          <>
            <Typography variant="body2" sx={styles.yourChannel(theme)}>
              {Data?.fname} {Data?.lname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Data?.email}
            </Typography>
          </>
        )}
      </Box>

      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            backgroundColor: active
              ? theme.palette.action.selected
              : "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            color: theme.palette.text.primary,
          }),
        }}
      >
        <MenuItem
          active={activeMenu === "/dashboard"}
          component={<Link to="/dashboard" />}
          icon={<DashboardOutlinedIcon />}
          onClick={() => handleMenuClick("/dashboard")}
        >
          <Typography variant="body2">Dashboard</Typography>
        </MenuItem>
        <MenuItem
          active={activeMenu === "/room"}
          component={<Link to="/room" />}
          icon={<CreateNewFolderOutlinedIcon />}
          onClick={() => handleMenuClick("/room")}
        >
          <Typography variant="body2">สร้างห้อง</Typography>
        </MenuItem>
        <MenuItem
          active={activeMenu === "/report"}
          component={<Link to="/report" />}
          icon={<AnalyticsOutlinedIcon />}
          onClick={() => handleMenuClick("/report")}
        >
          <Typography variant="body2">Report</Typography>
        </MenuItem>
        <MenuItem
          active={activeMenu === "/setting"}
          component={<Link to="/setting" />}
          icon={<StyleOutlinedIcon />}
          onClick={() => handleMenuClick("/setting")}
        >
          <Typography variant="body2">Setting</Typography>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

const styles = {
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    my: 5,
  },
  avatar: {
    width: "50%",
    height: "auto",
    borderRadius: "50%",
    aspectRatio: "1 / 1",
  },
  yourChannel: (theme: Theme) => ({
    mt: 1,
    color: theme.palette.text.primary,
  }),
};

export default SideNav;
