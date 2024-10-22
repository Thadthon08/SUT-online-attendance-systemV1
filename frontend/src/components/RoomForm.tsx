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
  ScheduleRounded,
} from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GetAllSubject } from "../services/api";
import { SubjectInterface } from "../interface/ISubject";
import { RoomInterface } from "../interface/IRoom";
import { UserData } from "../interface/Signinrespone";

interface CustomDatePickerInputProps {
  value: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
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
      inputRef={ref}
      error={error}
      helperText={helperText}
      placeholder="เลือกวันที่และเวลา"
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
  onSubmit: (data: RoomInterface) => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const [subjects, setSubjects] = useState<SubjectInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sub_id: "",
      ATR_name: "",
      start_time: new Date(),
      end_time: new Date(),
    },
  });

  const start_time = watch("start_time");
  const selectedSubjectId = watch("sub_id");

  useEffect(() => {
    const data = localStorage.getItem("data");

    let tid: string = "";
    if (data) {
      const parsedData = JSON.parse(data) as UserData;
      tid = parsedData.id;
    }
    const fetchSubjects = async () => {
      try {
        const result = await GetAllSubject(tid);
        setSubjects(result);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch subjects.");
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // อัปเดตค่า ATR_name เมื่อเลือกวิชา
  useEffect(() => {
    const selectedSubject = subjects.find(
      (subject) => subject.sub_id === selectedSubjectId
    );
    if (selectedSubject) {
      const roomName = `${
        selectedSubject.sub_code
      }เช็คชื่อ${new Date().toLocaleDateString()}ครั้งที่ 1`;
      setValue("ATR_name", roomName); // ตั้งชื่อห้องอัตโนมัติ
    }
  }, [selectedSubjectId, subjects, setValue]);

  const handleFormSubmit = (formData: any) => {
    const startTimeUTC = formData.start_time.toISOString();
    const endTimeUTC = formData.end_time.toISOString();

    const dataToSend = {
      ...formData,
      start_time: startTimeUTC,
      end_time: endTimeUTC,
    };

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
              เลือกวิชา
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
                  {subjects.map((subject: SubjectInterface) => (
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

          {/* Start Time */}
          <FormControl fullWidth error={!!errors.start_time}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              เวลาเริ่มต้น
            </Typography>
            <Controller
              name="start_time"
              control={control}
              rules={{ required: "กรุณาเลือกเวลาเริ่มต้น" }}
              render={({ field }) => (
                <DatePicker
                  disabled
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  customInput={
                    <CustomDatePickerInput
                      value={field.value ? field.value.toLocaleString() : ""}
                      onClick={(e: React.MouseEvent) =>
                        (e.target as HTMLInputElement).focus()
                      }
                      error={!!errors.start_time}
                      helperText={errors.start_time?.message}
                    />
                  }
                  showTimeSelect
                  dateFormat="Pp"
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth error={!!errors.end_time}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              เวลาสิ้นสุด
            </Typography>
            <Controller
              name="end_time"
              control={control}
              rules={{ required: "กรุณาเลือกเวลาสิ้นสุด" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  filterDate={(date) => date.getTime() >= start_time.getTime()}
                  filterTime={(time) => {
                    if (start_time && field.value) {
                      const start = new Date(start_time);
                      const end = new Date(field.value);

                      if (start.toDateString() === end.toDateString()) {
                        return time.getTime() > start_time.getTime();
                      }
                    }
                    return true;
                  }}
                  customInput={
                    <CustomDatePickerInput
                      value={field.value ? field.value.toLocaleString() : ""}
                      onClick={(e: React.MouseEvent) =>
                        (e.target as HTMLInputElement).focus()
                      }
                      error={!!errors.end_time}
                      helperText={errors.end_time?.message}
                    />
                  }
                  showTimeSelect
                  timeIntervals={5}
                  dateFormat="Pp"
                />
              )}
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
              bgcolor: "#de360c",
              color: "#ffffffff",
              "&:hover": {
                bgcolor: "#ff3908",
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
