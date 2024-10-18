import { useEffect } from "react";

interface StudentRouteProps {
  children: JSX.Element;
}

const StudentRoute = ({ children }: StudentRouteProps) => {
  useEffect(() => {
    const initializeLiff = async () => {
      const liff = (await import("@line/liff")).default;

      try {
        const liffId = "2006449283-GBkW3xMB";
        if (!liffId) {
          throw new Error("LIFF ID is not defined");
        }
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
        }
      } catch (error) {
        console.error(error);
      }
    };

    initializeLiff();
  });

  return children;
};

export default StudentRoute;
