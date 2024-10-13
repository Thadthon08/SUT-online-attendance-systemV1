import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./config/theme";
import "./index.css";
import { ProSidebarProvider } from "react-pro-sidebar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProSidebarProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ProSidebarProvider>
  </StrictMode>
);
