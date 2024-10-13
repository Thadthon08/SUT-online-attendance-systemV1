import { Button } from "@mui/material";

interface LoginButtonProps {
  isSubmitting: boolean;
  label: string;
}

const LoginButton = ({ isSubmitting, label }: LoginButtonProps) => {
  return (
    <Button
      variant="contained"
      fullWidth
      type="submit"
      disabled={isSubmitting}
      sx={{
        backgroundColor: "rgb(242, 101, 34)",
        borderRadius: "0px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "rgb(230, 92, 28)",
        },
      }}
    >
      {isSubmitting ? "Logging in..." : label}
    </Button>
  );
};

export default LoginButton;
