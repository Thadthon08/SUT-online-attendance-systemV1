import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import {
  Logout,
  Settings,
  Person,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useProSidebar } from "react-pro-sidebar";
import logoM from "../assets/ENGi Logo-Official.png";
import logoN from "../assets/ENGi Logo-White.png";
import { logout } from "../utils/logoutUtils";
import { UserData } from "../interface/Signinrespone";
import { Theme } from "@mui/material/styles";
import { useThemeContext } from "../context/ThemeContext";

interface AppHeaderProps {
  Data?: UserData;
}

const AppHeader: React.FC<AppHeaderProps> = ({ Data }) => {
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();
  const { collapseSidebar, toggleSidebar, broken } = useProSidebar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="sticky" sx={styles.appBar(theme)}>
      <Toolbar>
        <IconButton
          onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Box
          component="img"
          sx={styles.appLogo}
          src={theme.palette.mode === "light" ? logoM : logoN}
          alt="Logo"
        />
        <Typography variant="h6" sx={styles.appTitle}>
          SUT Online Attendance System
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton title="Notifications" color="inherit">
          <NotificationsOutlined />
        </IconButton>
        <IconButton
          title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
          onClick={toggleColorMode}
          color="inherit"
          sx={{
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "rotate(90deg)",
            },
          }}
        >
          {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
        <IconButton
          size="large"
          aria-controls="menu"
          aria-haspopup="true"
          color="inherit"
          onClick={handleMenuOpen}
        >
          <Avatar src={Data?.profile_pic} alt="Avatar" sx={styles.avatar} />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: styles.menu(theme),
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
            <Person sx={styles.menuIcon} /> Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={styles.menuItem}>
            <Settings sx={styles.menuIcon} /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={styles.menuItem}>
            <Logout sx={styles.menuIcon} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const styles = {
  appBar: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 1px 3px rgba(0,0,0,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
  }),
  appLogo: {
    borderRadius: 2,
    width: 40,
    marginLeft: 2,
    cursor: "pointer",
  },
  appTitle: {
    ml: "20px",
    fontSize: "20px",
    fontWeight: 500,
    display: {
      xs: "none",
      sm: "block",
    },
  },
  avatar: {
    width: 32,
    height: 32,
  },
  menu: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 20px rgba(0,0,0,0.3)"
        : "0 4px 20px rgba(0,0,0,0.1)",
  }),
  menuItem: {
    px: "30px",
  },
  menuIcon: {
    fontSize: "20px",
    mr: "20px",
  },
};

export default AppHeader;
