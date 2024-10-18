import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Verify } from "../services/api";
import StudentDashboard from "../pages/Student"; // หน้าสำหรับ Dashboard
import StudentRegister from "../pages/Register"; // หน้าสำหรับ Register

const StudentRoute = () => {
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
          setIsVerified(true); // ผู้ใช้ลงทะเบียนแล้ว
        } else {
          setIsVerified(false); // ผู้ใช้ยังไม่ลงทะเบียน
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
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // ถ้า isVerified === true แสดงหน้า Dashboard
  // ถ้า isVerified === false แสดงหน้า Register
  return isVerified ? <StudentDashboard /> : <StudentRegister />;
};

export default StudentRoute;
