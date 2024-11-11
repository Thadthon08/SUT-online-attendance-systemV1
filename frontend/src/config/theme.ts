// src/theme/theme.ts
import { createTheme, PaletteMode } from "@mui/material";

export const getThemeTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: "#F97316",
      light: mode === "light" ? "#FB923C" : "#FB923C",
      dark: mode === "light" ? "#EA580C" : "#EA580C",
    },
    secondary: {
      main: mode === "light" ? "#64748B" : "#94A3B8",
      light: mode === "light" ? "#94A3B8" : "#CBD5E1",
      dark: mode === "light" ? "#475569" : "#475569",
    },
    background: {
      default: mode === "light" ? "#F8FAFC" : "#0F172A",
      paper: mode === "light" ? "#FFFFFF" : "#1E293B",
    },
    text: {
      primary: mode === "light" ? "#1E293B" : "#F1F5F9",
      secondary: mode === "light" ? "#64748B" : "#94A3B8",
    },
    action: {
      selected:
        mode === "light"
          ? "rgba(249, 115, 22, 0.12)"
          : "rgba(249, 115, 22, 0.16)",
      hover:
        mode === "light"
          ? "rgba(249, 115, 22, 0.04)"
          : "rgba(249, 115, 22, 0.08)",
    },
    divider: mode === "light" ? "#E2E8F0" : "#334155",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
            "& fieldset": {
              borderColor: mode === "light" ? "#E2E8F0" : "#475569",
            },
            "&:hover fieldset": {
              borderColor: "#F97316",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#F97316",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-contained": {
            backgroundColor: "#F97316",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#EA580C",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
          borderColor: mode === "light" ? "#E2E8F0" : "#475569",
        },
      },
    },
  },
});

// สร้าง theme
export const createAppTheme = (mode: PaletteMode) => {
  const themeOptions = getThemeTokens(mode);
  return createTheme(themeOptions);
};
