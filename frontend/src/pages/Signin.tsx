import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { SigninInterface } from "../interface/ISignin";
import { SignIn } from "../services/api";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Signin.css";
import { decodeToken } from "../utils/tokenUtils";
import { showToast } from "../utils/toastUtils";

const SigninForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInterface>();

  const navigate = useNavigate();
  document.title = "Signin | Attendance System";

  const onSubmit = async (data: SigninInterface) => {
    setIsSubmitting(true);

    try {
      const response = await SignIn(data);

      if (response.token) {
        const token = response.token;
        localStorage.setItem("token", token);

        const userData = decodeToken(token);
        if (userData) {
          localStorage.setItem("data", JSON.stringify(userData));
          showToast("Signin successful!", "success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      }
    } catch (error) {
      const errorMsg =
        (error as any)?.response?.data?.message ||
        "Signin failed. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = {
    borderRadius: "4px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      backgroundColor: "#FFFFFF",
      color: "#1E293B",
      "& fieldset": {
        borderColor: "#E2E8F0",
      },
      "&:hover fieldset": {
        borderColor: "#F97316",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#F97316",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "#EF4444",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
      WebkitTextFillColor: "#1E293B",
    },
    "& input:-webkit-autofill:hover": {
      WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
    },
    "& input:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
    },
    "& input:-webkit-autofill:active": {
      WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
    },
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mb={3}>
          <TextField
            placeholder="Teacher ID"
            fullWidth
            size="small"
            autoComplete="username"
            autoFocus
            {...register("tid", {
              required: "Teacher ID is required",
              minLength: { value: 5, message: "Minimum length is 5" },
            })}
            error={!!errors.tid}
            helperText={errors.tid ? errors.tid.message : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: "#64748B" }} />{" "}
                  {/* Slate 500 for icon */}
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Box>

        <Box mb={3}>
          <TextField
            placeholder="Password"
            type="password"
            size="small"
            fullWidth
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum length is 6" },
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#64748B" }} />
                </InputAdornment>
              ),
            }}
            sx={inputStyles}
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#F97316",
            borderRadius: "4px",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bolder",
            "&:hover": {
              backgroundColor: "#EA580C",
            },
            "&:disabled": {
              backgroundColor: "#F97316",
            },
          }}
        >
          {isSubmitting ? "Sign in..." : "Sign in"}
        </Button>
      </form>
    </>
  );
};

const Signin = () => {
  return (
    <div className="bg-image">
      <div className="md:container md:mx-auto h-lvh flex items-center justify-center">
        <Card
          className="w-1/2 min-w-80 max-w-md"
          sx={{
            borderRadius: "8px",
            backgroundColor: "rgba(160, 180, 209, 0.2)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={"bolder"}
            className="text-center p-3 m-0"
            sx={{
              backgroundColor: "rgba(160, 180, 209, 0.3)",
              color: "#ffffff",
            }}
          >
            SUT ATTENDANCE SYSTEM
          </Typography>
          <Box className="p-10" sx={{ backgroundColor: "transparent" }}>
            <SigninForm />
          </Box>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signin;
