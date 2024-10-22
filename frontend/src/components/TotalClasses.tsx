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
import { getAllClasses } from "../services/api";

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: "#ffffff";
      color: ${theme.palette.primary.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow:  "#ffffff";
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

interface Props {
  teacherId: string;
}

function TotalClasses({ teacherId }: Props) {
  const [classCount, setClassCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (teacherId) {
          const data = await getAllClasses(teacherId);
          setClassCount(data.classCount);
        }
      } catch (error) {
        setError("Failed to fetch total classes.");
      }
    };

    fetchData();
  }, [teacherId]);

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" color="text.primary">
          {"Total Classes"}
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
            primary={error ? "Error" : classCount ?? "Loading..."}
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
                  {"See all classes"}
                </Link>
                <Box
                  component="span"
                  sx={{
                    pl: 0.5,
                  }}
                >
                  {"created by this teacher."}
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

export default TotalClasses;
