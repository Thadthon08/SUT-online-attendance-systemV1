import { Navigate } from "react-router-dom";
import { decodeToken } from "../utils/tokenUtils";
import { logout } from "../utils/logoutUtils";

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  const decodedToken: any = decodeToken(token);
  if (!decodedToken) return false;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    logout();
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
