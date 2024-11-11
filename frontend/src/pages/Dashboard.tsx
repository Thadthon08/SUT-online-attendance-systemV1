import { Container, Grid, Skeleton, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { UserData } from "../interface/Signinrespone";
import SubjectsTaught from "../components/SubjectsTaught";
import TotalAttendances from "../components/TotalAttendances";
import TotalClasses from "../components/TotalClasses";
import AverageAttendanceRate from "../components/AverageAttendanceRate";
import AttendanceOverview from "../components/AttendanceOverview";
import TitleHeader from "../components/TitleHeader";

const Dashboard = () => {
  document.title = "Dashboard | Attendance System";
  const [teacherId, setTeacherId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("data");

    if (data) {
      try {
        const parsedData = JSON.parse(data) as UserData;
        setTeacherId(parsedData.id);
        setLoading(false);
      } catch (err) {
        setError("Failed to parse user data.");
        setLoading(false);
      }
    } else {
      setError("No user data found.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Container>
        <Grid container spacing={4}>
          {Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

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
      <TitleHeader
        Title="Dashboard"
        Subtitle="Manage and monitor all aspects related to attendance and performance tracking in this system."
      />
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
            width={"full"}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item sm={6} xs={12}>
              <SubjectsTaught teacherId={teacherId} />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TotalAttendances teacherId={teacherId} />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TotalClasses teacherId={teacherId} />
            </Grid>
            <Grid item sm={6} xs={12}>
              <AverageAttendanceRate teacherId={teacherId} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <AttendanceOverview teacherId={teacherId} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
