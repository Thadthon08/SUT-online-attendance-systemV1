import React from "react";
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

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

const subIds = [
  { id: 1, label: "บริษัท A" },
  { id: 2, label: "บริษัท B" },
  { id: 3, label: "บริษัท C" },
];

const timeZone = "Asia/Bangkok";

// ฟังก์ชันดึงเวลาปัจจุบันและแปลงเป็นเขตเวลา "Asia/Bangkok"
const getCurrentDateTime = () => {
  return dayjs().tz(timeZone).format("YYYY-MM-DDTHH:mm");
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
>(({ value, onClick, error, helperText }, ref) => (
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
          <ScheduleRounded />
        </InputAdornment>
      ),
    }}
    sx={{
      bgcolor: "white",
      borderRadius: 1,
      "& .MuiInputBase-input": {
        color: "#000000",
        marginLeft: "0px",
        cursor: "pointer",
        height: "24px",
        padding: "16.5px 14px 16.5px 0px",
      },
    }}
  />
));

interface RoomFormProps {
  onSubmit: (data: any) => void;
  currentLocation: { lat: number; lng: number };
}

export const RoomForm: React.FC<RoomFormProps> = ({ onSubmit }) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sub_id: "",
      ATR_name: "",
      start_time: getCurrentDateTime(),
      end_time: getCurrentDateTime(),
    },
  });

  const startTime = watch("start_time");

  return (
    <Box sx={{ p: 1, color: "white", overflow: "hidden" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        สร้างห้องใหม่
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.sub_id}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              วิชา
            </Typography>
            <Controller
              name="sub_id"
              control={control}
              rules={{ required: "กรุณาเลือกบริษัท" }}
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  sx={{ bgcolor: "white", borderRadius: 1, height: "56px" }}
                  startAdornment={
                    <InputAdornment position="start">
                      <BusinessRounded />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    เลือกวิชา
                  </MenuItem>
                  {subIds.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.label}
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
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RoomRounded />
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
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  disabled
                  sx={{
                    bgcolor: "white",
                    borderRadius: 1,
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeRounded />
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
                  // ไม่ต้องแปลงเป็น UTC ให้เก็บเป็นเวลาประเทศไทย
                  const localizedDate = dayjs(date)
                    .tz(timeZone)
                    .format("YYYY-MM-DDTHH:mm");
                  field.onChange(localizedDate);
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
                    minDate={dayjs(startTime).toDate()}
                    minTime={dayjs(startTime).toDate()}
                    maxTime={dayjs(startTime).endOf("day").toDate()}
                    customInput={
                      <CustomDatePickerInput
                        value={
                          field.value
                            ? dayjs(field.value)
                                .tz(timeZone)
                                .format("DD MMMM YYYY HH:mm")
                            : ""
                        }
                        onClick={field.onChange}
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
            color="error"
            size="large"
            sx={{
              mt: 2,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 1,
              height: "56px",
            }}
          >
            สร้างห้อง
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
