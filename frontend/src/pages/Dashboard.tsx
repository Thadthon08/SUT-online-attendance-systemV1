import { alpha, Container, Grid, Typography } from "@mui/material";
import theme from "../config/theme";
import { useEffect, useState } from "react";
import { UserData } from "../interface/Signinrespone";
import SubjectsTaught from "../components/SubjectsTaught";
import TotalAttendances from "../components/TotalAttendances";
import TotalClasses from "../components/TotalClasses";
import AverageAttendanceRate from "../components/AverageAttendanceRate";
import AudienceOverview from "../components/AudienceOverview";

const Dashboard = () => {
  document.title = "Dashboard | Attendance System";
  const [teacherId, setTeacherId] = useState<string>("");

  useEffect(() => {
    const data = localStorage.getItem("data");

    if (data) {
      const parsedData = JSON.parse(data) as UserData;
      setTeacherId(parsedData.id);
    }
  }, []);

  return (
    <Container
      sx={{
        minHeight: "100vh",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        p: 4,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          maxWidth: 1472,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: 0,
          p: 2,
          mb: 3,
        }}
      >
        <Grid item>
          <Typography variant="h5" fontWeight={"bolder"}>
            Dashboard
          </Typography>

          <Typography variant="subtitle2">
            {
              "All aspects related to the app users can be managed from this page"
            }
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="start"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item lg={8} md={6} xs={12}>
          <Grid
            container
            spacing={4}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item sm={6} xs={12}>
              <SubjectsTaught teacherId={teacherId} />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TotalClasses teacherId={teacherId} />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TotalAttendances teacherId={teacherId} />
            </Grid>
            <Grid item sm={6} xs={12}>
              <AverageAttendanceRate teacherId={teacherId} />
            </Grid>
            <Grid item xs={12}>
              <AudienceOverview />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
