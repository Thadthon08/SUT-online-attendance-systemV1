import { alpha, Container, Typography, Button, Grid } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import theme from "../config/theme";

export default function Setting() {
  document.title = "Setting | Attendance System";
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
            Setting Management
          </Typography>

          <Typography variant="subtitle2">
            {
              "All aspects related to the app users can be managed from this page"
            }
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 },
            }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {"Add Subject"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
