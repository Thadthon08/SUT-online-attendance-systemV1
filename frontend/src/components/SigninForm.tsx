import { useState } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { SigninInterface } from "../interface/ISignin";
import { SignIn } from "../services/api";
import { showToast } from "../utils/toastUtils";
import SigninTextField from "./SigninTextField";
import SigninButton from "./SigninButton";

const SigninForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInterface>();

  const onSubmit = async (data: SigninInterface) => {
    setIsSubmitting(true);

    try {
      const response = await SignIn(data);

      if (response.token) {
        const token = response.token;
        localStorage.setItem("token", token);
        showToast("Signin successful!", "success");
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mb={3}>
          <SigninTextField
            placeholder="Teacher ID"
            name="tid"
            icon="account"
            register={register}
            errors={errors}
            validationRules={{
              required: "Teacher ID is required",
              minLength: { value: 5, message: "Minimum length is 5" },
            }}
          />
        </Box>

        <Box mb={3}>
          <SigninTextField
            placeholder="Password"
            name="password"
            type="password"
            icon="lock"
            register={register}
            errors={errors}
            validationRules={{
              required: "Password is required",
              minLength: { value: 6, message: "Minimum length is 6" },
            }}
          />
        </Box>

        <SigninButton isSubmitting={isSubmitting} label="Log in" />
      </form>
    </>
  );
};

export default SigninForm;
