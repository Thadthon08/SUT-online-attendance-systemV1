import { useEffect, useState } from "react";
import {
  Link,
  CardContent,
  Avatar,
  Box,
  Typography,
  ListItemAvatar,
  Card,
  ListItemText,
  ListItem,
  styled,
} from "@mui/material";
import AssessmentTwoToneIcon from "@mui/icons-material/AssessmentTwoTone";
import { getAverageAttendanceRate } from "../services/api"; // Import API service

// Styled Avatar component
const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: "#ffffff";
      color: ${theme.palette.primary.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow:  "#ffffff";
`
);

// Styled CardContent component
const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
  
     &:last-child {
     padding-bottom: 0;
     }
`
);

// Props interface สำหรับรับ teacherId
interface Props {
  teacherId: string;
}

function AverageAttendanceRate({ teacherId }: Props) {
  const [attendanceRate, setAttendanceRate] = useState<number | null>(null); // เก็บข้อมูลค่าเฉลี่ยอัตราการเข้าร่วมเรียน
  const [error, setError] = useState<string | null>(null); // จัดการ error

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherId) {
          const data = await getAverageAttendanceRate(teacherId); // เรียก API getAverageAttendanceRate
          setAttendanceRate(data.averageAttendanceRate); // อัปเดตค่าเฉลี่ยอัตราการเข้าร่วมเรียน
        }
      } catch (error) {
        setError("Failed to fetch average attendance rate.");
      }
    };

    fetchData();
  }, [teacherId]); // ดึงข้อมูลใหม่เมื่อ teacherId เปลี่ยน

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" color="text.primary">
          {"Average Attendance Rate"}
        </Typography>

        <ListItem
          disableGutters
          sx={{
            my: 1,
          }}
          component="div"
        >
          <ListItemAvatar>
            <AvatarSuccess variant="rounded">
              <AssessmentTwoToneIcon fontSize="large" />
            </AvatarSuccess>
          </ListItemAvatar>

          <ListItemText
            primary={error ? "Error" : `${attendanceRate ?? "Loading..."}%`} // แสดงค่าเฉลี่ยหรือข้อความ Error หรือ Loading
            primaryTypographyProps={{
              variant: "h1",
              sx: {
                ml: 2,
                fontSize: "46px",
              },
              noWrap: true,
            }}
          />
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            mt: 0.5,
            mb: 1.5,
          }}
          component="div"
        >
          <ListItemText
            primary={
              <>
                <Link fontWeight="bold" href="#">
                  {"See attendance details"}
                </Link>
                <Box
                  component="span"
                  sx={{
                    pl: 0.5,
                  }}
                >
                  {"for the subjects taught by this teacher."}
                </Box>
              </>
            }
            primaryTypographyProps={{ variant: "body2", noWrap: true }}
          />
        </ListItem>
      </CardContentWrapper>
    </Card>
  );
}

export default AverageAttendanceRate;