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
    <div className="relative min-h-screen overflow-hidden">
      {/* Mobile Background Image - Desktop-6.png */}
      <div className="md:hidden fixed inset-0 w-full h-full z-0">
        <Image
          src="/Desktop-6.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          style={{ objectPosition: "center" }}
          sizes="100vw"
          unoptimized
        />
      </div>

      {/* Desktop Background Image Section */}
      <div className="hidden md:block fixed inset-0 w-full h-full z-0">
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
      {/* Login Form Section - Responsive positioning */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20">
        <div
          className={cn(
            "w-full flex justify-center items-center", // center on small screens
            "md:block md:w-auto",
            "md:absolute md:top-[305px]",
            isRTL
              ? "md:right-[88px] md:left-auto"
              : "md:left-[88px] md:right-auto"
          )}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
