import { useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import { Link } from "react-router-dom";
import profile from "../assets/logo_round.png";

const SideNav = () => {
  // useProSidebar hook to control the sidebar
  const { collapsed, toggleSidebar } = useProSidebar();
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    toggleSidebar();
  };

  return (
    <Sidebar
      style={{ height: "100vh", top: "auto" }}
      breakPoint="md"
      backgroundColor={"white"}
    >
      <Box sx={styles.avatarContainer}>
        <Avatar sx={styles.avatar} alt="Masoud" src={profile} />
        {!collapsed ? (
          <Typography variant="body2" sx={styles.yourChannel}>
            Samit Koyom
          </Typography>
        ) : null}
        {!collapsed ? (
          <Typography variant="body2">Administrator</Typography>
        ) : null}
      </Box>

      <Menu
        menuItemStyles={{
          button: ({ active }) => {
            return {
              backgroundColor: active ? "rgba(0, 0, 0, 0.04)" : "transparent",
            };
          },
        }}
      >
        <MenuItem
          active={activeMenu == "/dashboard"}
          component={<Link to="/dashboard" />}
          icon={<DashboardOutlinedIcon />}
          onClick={() => handleMenuClick("/dashboard")}
        >
          {" "}
          <Typography variant="body2">Dashboard</Typography>{" "}
        </MenuItem>
        <MenuItem
          active={activeMenu == "/product"}
          component={<Link to="/product" />}
          icon={<SourceOutlinedIcon />}
          onClick={() => handleMenuClick("/product")}
        >
          {" "}
          <Typography variant="body2">Product </Typography>
        </MenuItem>
        <MenuItem
          active={activeMenu == "/report"}
          component={<Link to="/report" />}
          icon={<AnalyticsOutlinedIcon />}
          onClick={() => handleMenuClick("/report")}
        >
          {" "}
          <Typography variant="body2">Report </Typography>
        </MenuItem>
        <MenuItem
          active={activeMenu == "/setting"}
          component={<Link to="/setting" />}
          icon={<StyleOutlinedIcon />}
          onClick={() => handleMenuClick("/setting")}
        >
          {" "}
          <Typography variant="body2">Setting </Typography>
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
    my: 5,
  },
  avatar: {
    width: "40%",
    height: "auto",
  },
  yourChannel: {
    mt: 1,
  },
};

export default SideNav;
