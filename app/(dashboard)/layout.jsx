"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { useLocale } from "../../components/utils/useLocale";
import { useEffect } from "react";
import { cn } from "../../components/utils/cn";

export default function DashboardLayout({ children }) {
  const { locale, isRTL } = useLocale();

  useEffect(() => {
    // Ensure locale is applied on mount
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      // Use RTL for Arabic, LTR for English
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <Sidebar />
      <main
        className={cn(
          "mt-16 p-6 bg-white min-h-[calc(100vh-4rem)] border-t-2 border-white",
          isRTL
            ? "mr-64 rounded-tr-lg"
            : "ml-64 rounded-tl-lg"
        )}
      >
        {children}
      </main>
    </div>
  );
}
