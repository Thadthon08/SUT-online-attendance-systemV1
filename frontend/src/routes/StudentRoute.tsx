import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Verify } from "../services/api";

interface StudentRouteProps {
  children: JSX.Element;
}

const StudentRoute = ({ children }: StudentRouteProps) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      const liff = (await import("@line/liff")).default;

      try {
        const liffId = "2006449283-GBkW3xMB";
        if (!liffId) throw new Error("LIFF ID is not defined");

        await liff.init({ liffId });
        if (!liff.isLoggedIn()) liff.login();

        const profileData = await liff.getProfile();

        const verifyResponse = await Verify(profileData.userId);

        if (verifyResponse.status === "success") {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Failed to verify. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    initializeLiff();
  }, []);

  useEffect(() => {
    if (isVerified === false) {
      navigate("/student/register");
    }
  }, [isVerified, navigate]);

  return isVerified === true ? children : null;
};

export default StudentRoute;
