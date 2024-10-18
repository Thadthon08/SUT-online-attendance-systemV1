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
  const [loading, setLoading] = useState(true); // ใช้สำหรับแสดงสถานะการโหลด

  useEffect(() => {
    const initializeLiff = async () => {
      const liff = (await import("@line/liff")).default;

      try {
        const liffId = "2006449283-GBkW3xMB"; // LIFF ID ของคุณ
        if (!liffId) throw new Error("LIFF ID is not defined");

        await liff.init({ liffId });
        if (!liff.isLoggedIn()) liff.login();

        // ดึงข้อมูลโปรไฟล์จาก LINE
        const profileData = await liff.getProfile();
        const userId = profileData.userId;

        // เรียก API เพื่อเช็คว่ามีข้อมูลของผู้ใช้นี้หรือไม่
        const verifyResponse = await Verify(userId);

        if (verifyResponse.status === "success") {
          setIsVerified(true); // ถ้าผ่านให้อนุญาตเข้าถึงหน้า Student
        } else {
          setIsVerified(false); // ถ้าไม่ผ่านให้ไป Register
        }
      } catch (error) {
        console.error("Error verifying student:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to verify student. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false); // เมื่อโหลดเสร็จ
      }
    };

    initializeLiff();
  }, []);

  useEffect(() => {
    if (!loading && isVerified === false) {
      navigate("/student/register"); // ถ้า verify ไม่ผ่านให้ไปหน้า Register
    }
  }, [isVerified, loading, navigate]);

  // ถ้ากำลังโหลดข้อมูลอยู่ จะแสดง spinner
  if (loading) {
    return (
      <div className="text-center">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // ถ้า verify ผ่านให้แสดงเนื้อหาหน้า
  return isVerified === true ? children : null;
};

export default StudentRoute;
