import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  Paper,
  Avatar,
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
import { StudentRegistration } from "../services/api";
import { showToast } from "../utils/toastUtils";

const Register = () => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentInterface>();
  const navigate = useNavigate();

  const onSubmit = async (data: StudentInterface) => {
    setIsSubmitting(true); // ตั้งสถานะกำลังดำเนินการ

    try {
      const response = await StudentRegistration(data); // เรียกใช้ API การลงทะเบียน

      if (response) {
        showToast("ลงทะเบียนสำเร็จ!", "success");
        navigate("/student");
      } else {
        throw new Error("เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      showToast("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                backgroundColor: "rgba(255, 255, 255, 0.05)", // สีเมื่อปุ่มถูก disable
                color: "rgba(255, 255, 255, 0.3)", // สีข้อความเมื่อปุ่มถูก disable
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
