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
import "./styles/login.css";
import { SigninInterface } from "../interface/ISignin";
import { SignIn } from "../services/api";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInterface>();

  const onSubmit = async (data: SigninInterface) => {
    const res: SigninInterface = await SignIn(data);
    console.log(res);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mb={3}>
        <TextField
          placeholder="Teacher ID"
          fullWidth
          size="small"
          {...register("tid", { required: true, minLength: 5 })}
          error={!!errors.tid}
          helperText={
            errors.tid ? "Teacher Id is required (min length: 5)" : ""
          }
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
          {...register("password", { required: true })}
          error={!!errors.password}
          helperText={errors.password ? "Password is required" : ""}
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
        Log in
      </Button>
    </form>
  );
};

const Login = () => {
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
          <Box className="p-5 bg-white">
            <LoginForm />
          </Box>
        </Card>
      </div>
    </div>
  );
};

export default Login;
