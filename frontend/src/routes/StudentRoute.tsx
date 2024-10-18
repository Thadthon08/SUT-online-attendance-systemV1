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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeLiff = async () => {
      const liff = (await import("@line/liff")).default;

      try {
        const liffId = "2006449283-GBkW3xMB"; // LIFF ID ของคุณ
        if (!liffId) throw new Error("LIFF ID is not defined");

        await liff.init({ liffId });
        if (!liff.isLoggedIn()) liff.login();

        const profile = await liff.getProfile();
        const lineId = profile.userId;

        // เรียก API Verify เพื่อตรวจสอบว่าผู้ใช้ลงทะเบียนหรือยัง
        const verifyResponse = await Verify(lineId);

        if (verifyResponse.status === "success") {
          setIsVerified(true); // ถ้าสำเร็จให้เข้าหน้า Student
          navigate("/student");
        } else {
          setIsVerified(false); // ถ้าไม่สำเร็จให้ไปหน้า Register
          navigate("/student/register");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to verify student. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeLiff();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return isVerified ? children : null;
};

export default StudentRoute;
