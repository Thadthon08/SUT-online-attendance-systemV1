import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

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
