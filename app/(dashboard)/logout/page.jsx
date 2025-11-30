"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { superuserLogout } from "../../../lib/api/authApi";
import { clearAuthTokens, getRefreshToken } from "../../../lib/api/axios";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Get refresh token from localStorage
        const refreshToken = getRefreshToken();

        // Call superuser logout API if refresh token exists
        if (refreshToken) {
          await superuserLogout(refreshToken);
        }
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with logout even if API call fails
      } finally {
        // Clear tokens from localStorage
        clearAuthTokens();
        // Redirect to login
        router.push("/login");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Logging out...</p>
    </div>
  );
}
