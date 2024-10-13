import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
