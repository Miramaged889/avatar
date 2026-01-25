"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/shadcn/ButtonWrapper";
import { useLocale } from "../components/utils/useLocale";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
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
        // Handle error - extract meaningful error message
        const err = result.error;
        let errorMessage = t("messages.loginFailed") || "Login failed. Please check your credentials.";

        // Handle different error formats
        if (err) {
          if (typeof err === "string") {
            errorMessage = err;
          } else if (err.detail) {
            // Django REST framework error format
            if (typeof err.detail === "string") {
              errorMessage = err.detail;
            } else if (Array.isArray(err.detail)) {
              errorMessage = err.detail.join(", ");
            } else {
              errorMessage = JSON.stringify(err.detail);
            }
          } else if (err.message) {
            errorMessage = err.message;
          } else if (err.non_field_errors) {
            // Field-specific errors
            if (Array.isArray(err.non_field_errors)) {
              errorMessage = err.non_field_errors.join(", ");
            } else {
              errorMessage = err.non_field_errors;
            }
          } else if (err.username || err.password) {
            // Credential-specific errors
            const credentialErrors = [];
            if (err.username) {
              credentialErrors.push(
                Array.isArray(err.username) ? err.username.join(", ") : err.username
              );
            }
            if (err.password) {
              credentialErrors.push(
                Array.isArray(err.password) ? err.password.join(", ") : err.password
              );
            }
            if (credentialErrors.length > 0) {
              errorMessage = credentialErrors.join(" ");
            }
          } else {
            // Try to extract any error message from object
            const errorKeys = Object.keys(err);
            if (errorKeys.length > 0) {
              const firstError = err[errorKeys[0]];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === "string") {
                errorMessage = firstError;
              }
            }
          }
        }

        // Translate common error messages
        const lowerError = errorMessage.toLowerCase();
        if (lowerError.includes("invalid") || lowerError.includes("incorrect")) {
          errorMessage = t("messages.invalidCredentials") || "Invalid username or password. Please try again.";
        } else if (lowerError.includes("network") || lowerError.includes("connection") || lowerError.includes("timeout")) {
          errorMessage = t("messages.networkError") || "Network error. Please check your connection and try again.";
        } else if (lowerError.includes("required") || lowerError.includes("missing")) {
          errorMessage = t("messages.requiredFields") || "Please fill in all required fields.";
        }

        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = t("messages.loginFailed") || "An error occurred during login";
      
      if (err?.message) {
        const lowerError = err.message.toLowerCase();
        if (lowerError.includes("network") || lowerError.includes("connection") || lowerError.includes("timeout")) {
          errorMessage = t("messages.networkError") || "Network error. Please check your connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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
        <div
          className={cn(
            "relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2",
            "bg-red-50 border-red-300 shadow-sm",
            isRTL && "text-right"
          )}
          role="alert"
          aria-live="polite"
        >
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-900 leading-relaxed">
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className={cn(
              "flex-shrink-0 text-red-400 hover:text-red-600 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            )}
            aria-label={t("buttons.close") || "Close error message"}
          >
            <X className="h-4 w-4" />
          </button>
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
