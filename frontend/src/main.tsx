import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProSidebarProvider>
      <ThemeProvider>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ProSidebarProvider>
  </StrictMode>
);
