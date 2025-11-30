"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/shadcn/ButtonWrapper";
import { useLocale } from "../components/utils/useLocale";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../components/utils/cn";
import { superuserLogin } from "../lib/api/authApi";
import { setAuthTokens } from "../lib/api/axios";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t, isRTL } = useLocale();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call superuser login API
      const result = await superuserLogin(username, password);

      if (result.success) {
        // Save tokens to localStorage
        const { access, refresh } = result.data;
        setAuthTokens(access, refresh);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Handle error
        const errorMessage =
          result.error?.detail ||
          result.error?.message ||
          result.error ||
          t("messages.loginFailed") ||
          "Login failed. Please check your credentials.";
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : JSON.stringify(errorMessage)
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.message ||
          t("messages.loginFailed") ||
          "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        " rounded-2xl flex flex-col gap-6", // white background & card effect
        "w-full max-w-[531px] md:px-10 md:py-10 px-4 py-8", // responsive padding
        "mx-auto"
      )}
      style={{
        width: "531px",
        height: "583px",
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      {/* LOGIN Heading */}
      <div>
        <p
          className=" font-bold text-primary-dark"
          style={{ fontSize: "72px" }}
        >
          {t("labels.login")}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Username Field */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label
          htmlFor="username"
          className="block text-xl font-medium text-gray-900 uppercase tracking-wide"
        >
          {t("labels.username") || "Username"}
        </label>
        <div className="relative">
          <input
            id="username"
            name="username"
            type="text"
            placeholder={t("placeholders.username") || "Enter your username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-transparent  px-0 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-dark transition-colors"
            style={{ borderBottom: "2px solid #000537", borderRadius: "0px" }}
          />
        </div>
      </div>

      {/* Password Field */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xl font-medium text-gray-900 uppercase tracking-wide"
          >
            {t("labels.password")}
          </label>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("placeholders.password")}
            required
            className="w-full bg-transparent  px-0 py-2  text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-dark transition-colors"
            style={{ borderBottom: "2px solid #000537", borderRadius: "0px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              "absolute bottom-2 text-gray-500 hover:text-gray-700",
              isRTL ? "left-0" : "right-0"
            )}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {/* Forgot Password Link */}
        <div
          className={cn("w-full flex", isRTL ? "justify-start" : "justify-end")}
        >
          <Link
            href="/forgot-password"
            className={cn(
              "text-l text-gray-500 hover:text-primary-dark transition-colors",
              isRTL && "text-right"
            )}
          >
            {t("messages.forgotPassword")}
          </Link>
        </div>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full bg-primary-dark text-white py-3 rounded-lg font-semibold text-base transition-colors"
        style={{ borderRadius: "50px" }}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : t("buttons.login")}
      </Button>
    </form>
  );
}
