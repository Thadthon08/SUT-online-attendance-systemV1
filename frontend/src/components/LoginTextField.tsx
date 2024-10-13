import { TextField, InputAdornment } from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";

interface LoginTextFieldProps {
  placeholder: string;
  type?: string;
  register: any;
  errors: any;
  name: string;
  icon: "account" | "lock";
  validationRules: any;
}

const LoginTextField = ({
  placeholder,
  type = "text",
  register,
  errors,
  name,
  icon,
  validationRules,
}: LoginTextFieldProps) => {
  const IconComponent = icon === "account" ? <AccountCircle /> : <Lock />;

  return (
    <TextField
      placeholder={placeholder}
      fullWidth
      size="small"
      type={type}
      {...register(name, validationRules)}
      error={!!errors[name]}
      helperText={errors[name] ? errors[name].message : ""}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{IconComponent}</InputAdornment>
        ),
      }}
      sx={{
        borderRadius: "0px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "0px",
        },
      }}
    />
  );
};

export default LoginTextField;
