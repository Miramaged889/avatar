"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { useLocale } from "../../components/utils/useLocale";
import { useEffect, useState } from "react";
import { cn } from "../../components/utils/cn";

export default function DashboardLayout({ children }) {
  const { locale, isRTL } = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Ensure locale is applied on mount
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      // Use RTL for Arabic, LTR for English
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  // Close sidebar when resizing to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-white">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className={cn(
          "mt-16 p-4 sm:p-6 bg-white min-h-[calc(100vh-4rem)] border-t-2 border-white transition-all duration-300",
          isRTL
            ? "md:mr-64 rounded-tr-lg"
            : "md:ml-64 rounded-tl-lg"
        )}
      >
        {children}
      </main>
    </div>
  );
}
