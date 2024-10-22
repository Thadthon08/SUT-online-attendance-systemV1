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
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { getTotalAttendances } from "../services/api";

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: #ff1944;
      color: #FFFFFF;
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
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

const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
  
     &:last-child {
     padding-bottom: 0;
     }
`
);

interface Props {
  teacherId: string;
}

function TotalAttendances({ teacherId }: Props) {
  const [attendanceCount, setAttendanceCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherId) {
          const data = await getTotalAttendances(teacherId);
          setAttendanceCount(data.totalAttendances);
        }
      } catch (error) {
        setError("Failed to fetch total attendances.");
      }
    };

    fetchData();
  }, [teacherId]);

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" color="text.primary">
          {"Total Attendances"}
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
              <HowToRegIcon fontSize="large" />
            </AvatarSuccess>
          </ListItemAvatar>

          <ListItemText
            primary={error ? "Error" : attendanceCount ?? "Loading..."}
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
                <StyledLink href="#">See all attendances</StyledLink>
                <Box
                  component="span"
                  sx={{
                    pl: 0.5,
                  }}
                >
                  {"that occurred in the subjects taught by this teacher."}
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

export default TotalAttendances;
