import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

let theme = createTheme();

theme = createTheme(theme, {
  palette: {
    mode: "dark",
    primary: {
      main: grey[300],
      light: grey[100],
      dark: grey[500],
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: grey[100],
      secondary: grey[400],
    },
    action: {
      selected: grey[800],
      hover: grey[700],
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          borderRadius: 1,
          borderColor: grey[600],
          "& .MuiInputBase-input": {
            color: grey[100],
            height: "24px",
            padding: "16.5px 14px 16.5px 0px",
          },
          "& .MuiInputBase-input::placeholder": {
            color: grey[400],
            opacity: 1,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: grey[600],
            },
            "&:hover fieldset": {
              borderColor: grey[400],
            },
            "&.Mui-focused fieldset": {
              borderColor: grey[300],
            },
          },
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px #1f1f1f inset",
            WebkitTextFillColor: "#ffffff",
          },
          "& input:-webkit-autofill:hover": {
            WebkitBoxShadow: "0 0 0 1000px #1f1f1f inset",
          },
          "& input:-webkit-autofill:focus": {
            WebkitBoxShadow: "0 0 0 1000px #1f1f1f inset",
          },
          "& input:-webkit-autofill:active": {
            WebkitBoxShadow: "0 0 0 1000px #1f1f1f  inset",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          color: grey[100],
          borderRadius: 1,
          height: "56px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[600],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[400],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[300],
          },
          "& .MuiSelect-icon": {
            color: grey[300],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 1,
          height: "56px",
          backgroundColor: grey[300],
          color: "#121212",
          "&:hover": {
            backgroundColor: grey[400],
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            color: grey[400],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            "& .MuiInputBase-input": {
              WebkitTextFillColor: grey[400],
            },
          },
        },
      },
    },
  },
});

export default theme;
