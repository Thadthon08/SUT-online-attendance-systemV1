import { toast } from "react-toastify";

export const showToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message, { position: "top-right", autoClose: 2000 });
  } else if (type === "error") {
    toast.error(message, { position: "top-right", autoClose: 2000 });
  }
};
