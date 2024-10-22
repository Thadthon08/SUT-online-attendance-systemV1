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
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { getSubjectTaught } from "../services/api";

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: #7367F0;
      color: #FFFFFF;
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
`
);

const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
  
     &:last-child {
     padding-bottom: 0;
     }
`
);

const StyledLink = styled(Link)`
  color: #7367f0;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
    color: #5e50ee;
  }
`;

// ปรับให้ props ถูกต้อง โดยกำหนด type ของ teacherId เป็น string
interface Props {
  teacherId: string;
}

function SubjectsTaught({ teacherId }: Props) {
  const [subjectCount, setSubjectCount] = useState(0); // เก็บข้อมูลจำนวนวิชาที่สอน
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherId) {
          // ตรวจสอบว่า teacherId มีค่าหรือไม่
          const data = await getSubjectTaught(teacherId); // เรียก API
          setSubjectCount(data.subjectCount); // อัปเดตจำนวนวิชาที่สอน
        }
      } catch (error) {
        setError("Failed to fetch subjects count.");
      }
    };

    fetchData();
  }, [teacherId]); // เพิ่ม teacherId เป็น dependency เพื่อให้ useEffect ทำงานเมื่อ teacherId เปลี่ยน

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" color="text.primary">
          {"Subjects Taught"}
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
              <AutoStoriesIcon fontSize="large" />
            </AvatarSuccess>
          </ListItemAvatar>

          <ListItemText
            primary={error ? "Error" : subjectCount} // แสดงจำนวนวิชาที่สอนหรือข้อความ Error
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
                <StyledLink href="#">{"See all subjects"}</StyledLink>
                <Box
                  component="span"
                  sx={{
                    pl: 0.5,
                  }}
                >
                  {"that are currently being taught."}
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

export default SubjectsTaught;
