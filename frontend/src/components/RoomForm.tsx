import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Box,
  Stack,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  BusinessRounded,
  RoomRounded,
  AccessTimeRounded,
  ScheduleRounded,
} from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { GetAllSubject } from "../services/api"; // API ดึงข้อมูลวิชา

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Bangkok"; // ใช้ Time Zone ของกรุงเทพ

const getCurrentDateTime = () => {
  return dayjs().tz(timeZone).format("YYYY-MM-DDTHH:mm"); // คืนค่าเวลาในรูปแบบที่ต้องการ
};

interface CustomDatePickerInputProps {
  value: string;
  onClick: () => void;
  error?: boolean;
  helperText?: string;
}

const CustomDatePickerInput = React.forwardRef<
  HTMLInputElement,
  CustomDatePickerInputProps
>(({ value, onClick, error, helperText }, ref) => {
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      value={value}
      onClick={onClick}
      ref={ref}
      error={error}
      helperText={helperText}
      placeholder="เลือกเวลาสิ้นสุด"
      InputProps={{
        readOnly: true,
        startAdornment: (
          <InputAdornment position="start">
            <ScheduleRounded sx={{ color: theme.palette.text.secondary }} />
          </InputAdornment>
        ),
      }}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 1,
        "& .MuiInputBase-input": {
          color: theme.palette.text.primary,
          cursor: "pointer",
          height: "24px",
          padding: "16.5px 14px 16.5px 0px",
        },
        "& .MuiInputBase-input::placeholder": {
          color: theme.palette.common.white,
          opacity: 1,
        },
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
          },
        },
      }}
    />
  );
});

interface RoomFormProps {
  onSubmit: (data: any) => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sub_id: "",
      ATR_name: "",
      start_time: getCurrentDateTime(),
      end_time: getCurrentDateTime(),
    },
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const result = await GetAllSubject();
        setSubjects(result);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch subjects.");
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleFormSubmit = (formData: any) => {
    // แปลงเวลาเป็น UTC ก่อนส่งข้อมูลไปยัง backend
    const startTimeUTC = dayjs(formData.start_time).tz(timeZone).utc().format();
    const endTimeUTC = dayjs(formData.end_time).tz(timeZone).utc().format();

    const dataToSend = {
      ...formData,
      start_time: startTimeUTC,
      end_time: endTimeUTC,
    };

    console.log("Form Data:", dataToSend);
    onSubmit(dataToSend);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box
      sx={{
        p: 2,
        color: theme.palette.text.primary,
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.sub_id}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              วิชา
            </Typography>
            <Controller
              name="sub_id"
              control={control}
              rules={{ required: "กรุณาเลือกวิชา" }}
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  variant="outlined"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                    height: "56px",
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessRounded
                        sx={{ color: theme.palette.text.secondary }}
                      />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    เลือกวิชา
                  </MenuItem>
                  {subjects.map((subject: any) => (
                    <MenuItem key={subject.sub_id} value={subject.sub_id}>
                      {subject.sub_code}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ชื่อห้อง
            </Typography>
            <Controller
              name="ATR_name"
              control={control}
              rules={{ required: "กรุณากรอกชื่อห้อง" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="กรอกชื่อห้อง"
                  variant="outlined"
                  fullWidth
                  error={!!errors.ATR_name}
                  helperText={errors.ATR_name?.message}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.common.white,
                    borderRadius: 1,
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.common.white,
                      opacity: 1,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RoomRounded
                          sx={{ color: theme.palette.text.secondary }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" sx={{ mb: 1 }}>
              เวลาเริ่มต้น
            </Typography>
            <Controller
              name="start_time"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  value={dayjs(field.value)
                    .tz(timeZone)
                    .format("DD/MM/YYYY HH:mm")}
                  fullWidth
                  disabled
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderColor: "white !important",
                    borderRadius: 1,
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #757575 !important",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: theme.palette.text.primary,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeRounded
                          sx={{ color: theme.palette.text.secondary }}
                        />
                      </InputAdornment>
                    ),
                    readOnly: true,
                  }}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" sx={{ mb: 1 }}>
              เวลาสิ้นสุด
            </Typography>
            <Controller
              name="end_time"
              control={control}
              rules={{ required: "กรุณาเลือกเวลาสิ้นสุด" }}
              render={({ field }) => {
                const handleDateChange = (date: any) => {
                  const utcDate = dayjs(date).tz(timeZone).utc().format(); // แปลงเวลาเป็น UTC ก่อนส่งออก
                  field.onChange(utcDate);
                };

                return (
                  <DatePicker
                    selected={
                      field.value
                        ? dayjs(field.value).tz(timeZone).toDate()
                        : null
                    }
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="dd/MM/yyyy HH:mm"
                    placeholderText="เลือกเวลาสิ้นสุด"
                    customInput={
                      <CustomDatePickerInput
                        value={
                          field.value
                            ? dayjs(field.value)
                                .tz(timeZone)
                                .format("DD MMMM YYYY HH:mm")
                            : ""
                        }
                        onClick={() => {}}
                        error={!!errors.end_time}
                        helperText={errors.end_time?.message}
                      />
                    }
                  />
                );
              }}
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 1,
              height: "56px",
              marginTop: "15px !important",
              bgcolor: theme.palette.primary.light,
              color: theme.palette.background.default,
              "&:hover": {
                bgcolor: theme.palette.primary.main,
              },
            }}
          >
            สร้างห้อง
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
