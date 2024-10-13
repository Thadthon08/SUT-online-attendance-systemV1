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
import { jwtDecode } from "jwt-decode";
import { SigninInterface } from "../interface/ISignin";
import { SignIn } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Signin.css";

const SigninForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInterface>();

  const decodeToken = (token: string) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const onSubmit = async (data: SigninInterface) => {
    setIsSubmitting(true);

    try {
      const response = await SignIn(data); // API call

      if (response.token) {
        const token = response.token;
        localStorage.setItem("token", token);

        const userData = decodeToken(token);
        if (userData) {
          localStorage.setItem("data", JSON.stringify(userData));
          toast.success("Login successful!", { position: "top-right" });
          console.log("User data:", userData);
        }
      }

      console.log(response.message);
    } catch (error) {
      const errorMsg =
        (error as any)?.response?.data?.message ||
        "Login failed. Please try again.";
      toast.error(errorMsg, { position: "top-right" });
      console.error("Login failed:", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
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
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "0px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
              },
            }}
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
                  <Lock />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "0px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={isSubmitting} // Disable the button while submitting
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
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <ToastContainer />{" "}
      {/* Add Toast container here for displaying notifications */}
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
            borderRadius: "0px",
          }}
        >
          <Typography
            variant="h5"
            className="text-center p-3 text-white m-0"
            sx={{ backgroundColor: "rgb(51, 51, 51)" }}
          >
            SUT Attendance
          </Typography>
          <Box className="p-10 bg-white">
            <SigninForm />
          </Box>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
