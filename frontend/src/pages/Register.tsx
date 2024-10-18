import React, { useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { StudentInterface } from "../interface/IStudent";
import {
  PersonOutline,
  BadgeOutlined,
  DriveFileRenameOutlineOutlined,
  HowToRegOutlined,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useProfile } from "../utils/useProfile";
import { StudentRegistration } from "../services/api";

const Register: React.FC = () => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { profile, isLoading } = useProfile();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentInterface>();

  const onSubmit = useCallback(
    async (data: StudentInterface) => {
      setIsSubmitting(true);
      data.LineID = profile?.userId as string;

      try {
        const response = await StudentRegistration(data);

        if (response) {
          Swal.fire({
            title: "ลงทะเบียนสำเร็จ",
            text: "กรุณากดปุ่ม OK เพื่อเข้าสู่หน้าหลัก",
            icon: "success",
            confirmButtonText: "OK",
            background: "#1e1e1e",
            color: "#ffffff",
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error("เกิดข้อผิดพลาดในการลงทะเบียน");
        }
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "OK",
          background: "#1e1e1e",
          color: "#ffffff",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [profile]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          padding: "32px",
          boxShadow: theme.shadows[3],
          marginTop: "40px",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            sx={{
              m: 1,
              bgcolor: theme.palette.secondary.main,
              width: theme.spacing(7),
              height: theme.spacing(7),
            }}
          >
            <HowToRegOutlined fontSize="large" />
          </Avatar>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
            }}
          >
            Student Registration
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box mb={3}>
            <Controller
              name="sid"
              control={control}
              defaultValue=""
              rules={{
                required: "กรุณากรอกรหัสนักศึกษา",
                pattern: {
                  value: /^B\d{7}$/,
                  message:
                    "รหัสนักศึกษาต้องขึ้นต้นด้วย B และตามด้วยตัวเลข 7 หลัก (เช่น B640XXXX)",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Student ID"
                  variant="outlined"
                  fullWidth
                  error={!!errors.sid}
                  helperText={errors.sid?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box mb={3}>
            <Controller
              name="St_fname"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณากรอกชื่อ" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.St_fname}
                  helperText={errors.St_fname?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box mb={4}>
            <Controller
              name="St_lname"
              control={control}
              defaultValue=""
              rules={{ required: "กรุณากรอกนามสกุล" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.St_lname}
                  helperText={errors.St_lname?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DriveFileRenameOutlineOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#000000",
              height: "56px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:disabled": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
