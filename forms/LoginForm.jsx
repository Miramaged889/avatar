"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/shadcn/ButtonWrapper";
import { useLocale } from "../components/utils/useLocale";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../components/utils/cn";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t, isRTL } = useLocale();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
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
        <p className="text-7xl font-bold text-primary-dark">{t("labels.login")}</p>
      </div>

      {/* Email Field */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label
          htmlFor="email"
          className="block text-xl font-medium text-gray-900 uppercase tracking-wide"
        >
          {t("labels.email")}
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            placeholder={t("placeholders.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
