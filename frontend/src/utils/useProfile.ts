import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        Swal.fire({
          title: "Loading...",
          text: "Fetching your profile...",
          icon: "info",
          allowOutsideClick: false,
          showConfirmButton: false,
          background: "#1e1e1e",
          color: "#ffffff",
          willOpen: () => Swal.showLoading(),
        });

        const liff = (await import("@line/liff")).default;
        await liff.ready;
        const profileData = await liff.getProfile();
        setProfile({
          userId: profileData.userId,
          displayName: profileData.displayName,
          pictureUrl: profileData.pictureUrl || "",
        });

        Swal.close();
      } catch (err) {
        Swal.fire({
          title: "Profile Error",
          text: "Failed to load profile. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#1e1e1e",
          color: "#ffffff",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading };
};
