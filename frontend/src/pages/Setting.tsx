import { Container } from "@mui/material";
import TitleHeader from "../components/TitleHeader";

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
      <TitleHeader
        Title="Setting Management"
        Subtitle="All aspects related to the app users can be managed from this page"
      />
    </Container>
  );
}
