// src/context/ThemeContext.tsx
import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, PaletteMode } from "@mui/material";
import { createAppTheme } from "../config/theme";

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // ดึงค่า theme จาก localStorage ถ้ามี
  const storedMode = localStorage.getItem("themeMode") as PaletteMode;
  const [mode, setMode] = useState<PaletteMode>(storedMode || "light");

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("themeMode", newMode);
      },
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
