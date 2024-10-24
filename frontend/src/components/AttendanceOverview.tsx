import { useState, useEffect } from "react";
import {
  Card,
  Box,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Divider,
  Alert,
  Skeleton,
} from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getAttendanceRateForAllSubjects } from "../services/api";

interface Props {
  teacherId: string;
}

function AttendanceOverview({ teacherId }: Props) {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAttendanceRateForAllSubjects(teacherId);
        setAttendanceData(data);
      } catch (err) {
        setError("Failed to fetch attendance data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherId]);

  if (loading) {
    return (
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardHeader title={"Attendance Overview"} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" width="100%" height={250} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardHeader title={"Attendance Overview"} />
        <Divider />
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardHeader title={"Attendance Overview"} />
      <CardContent>
        <Box mt={2}>
          <Grid container spacing={3}>
            {attendanceData.map((subjectData: any, index: number) => {
              const attendanceRate = parseFloat(
                subjectData.attendanceRate.replace("%", "")
              );
              const absenceRate = 100 - attendanceRate;

              const chartOptions: ApexOptions = {
                chart: {
                  type: "donut",
                  animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                  },
                },
                labels: ["Attendance", "Absence"],
                colors: ["#00E396", "#FEB019"],
                legend: {
                  position: "bottom",
                  fontSize: "14px",
                  labels: {
                    colors: "#333",
                  },
                  itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                  },
                },
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: "16px",
                    fontWeight: "bold",
                    colors: ["#333"],
                  },
                  formatter: (val: number) => `${val.toFixed(2)}%`,
                },
                tooltip: {
                  y: {
                    formatter: (val: number) => `${val.toFixed(2)}%`,
                  },
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 250,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
              };

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: 2,
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "#333" }}
                    >
                      {subjectData.sub_code}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#777", marginBottom: 2 }}
                    >
                      {subjectData.subject}
                    </Typography>

                    <Chart
                      options={chartOptions}
                      series={[attendanceRate, absenceRate]}
                      type="donut"
                      height={250}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AttendanceOverview;
