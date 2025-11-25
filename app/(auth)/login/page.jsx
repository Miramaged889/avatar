"use client";

import { LoginForm } from "../../../forms/LoginForm";
import { useLocale } from "../../../components/utils/useLocale";
import { useEffect } from "react";
import Image from "next/image";
import { cn } from "../../../components/utils/cn";

export default function LoginPage() {
  const { locale, isRTL } = useLocale();

  useEffect(() => {
    // Ensure locale is applied on mount
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      // Use RTL for Arabic, LTR for English
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  // Use Vector-right.png for Arabic, Vector.png for English
  const backgroundImage = isRTL ? "/Vector-right.png" : "/Vector.png";

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Image Section - Full Screen */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div className="relative w-full h-full">
          {/* Logo - top left for LTR, top right for RTL */}
          <div
            className={cn("absolute top-6 z-20", isRTL ? "right-6" : "left-6")}
          >
            <h1 className="text-6xl font-bold italic">
              <span className="text-accent-yellow">L</span>
              <span className="text-white">ogo</span>
            </h1>
          </div>

          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
            style={{ objectPosition: "center" }}
            sizes="100vw"
            unoptimized
          />
        </div>
      </div>
      {/* Login Form Section - Positioned according to language */}
      <div className="relative z-20">
        <div
          style={{
            position: "absolute",
            top: "305px",
            ...(isRTL ? { right: "88px" } : { left: "88px" }),
          }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
