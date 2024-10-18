import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect } from "react";

const StudentLayout = () => {
  return (
    <>
      <Box>
        <Outlet />
      </Box>
    </>
  );
};

export default StudentLayout;
