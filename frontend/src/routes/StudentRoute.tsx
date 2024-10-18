import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Verify } from "../services/api";
import StudentDashboard from "../pages/Student";
import StudentRegister from "../pages/Register";

const StudentRoute = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      const liff = (await import("@line/liff")).default;

      const liffId = "2006449283-GBkW3xMB";
      if (!liffId) throw new Error("LIFF ID is not defined");

      await liff.init({ liffId });
      if (!liff.isLoggedIn()) liff.login();

      const profile = await liff.getProfile();
      const lineId = profile.userId;

      const verifyResponse = await Verify(lineId);

      if (verifyResponse.status === "success") {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    };

    initializeLiff();
  }, []);

  // ถ้า isVerified === true แสดงหน้า Dashboard
  // ถ้า isVerified === false แสดงหน้า Register
  return isVerified ? <StudentDashboard /> : <StudentRegister />;
};

export default StudentRoute;
