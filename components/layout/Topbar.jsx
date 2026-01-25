"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";

export function Topbar({ onMenuClick }) {
  const { locale, setLocale, t, isRTL } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center gap-4  bg-primary-dark px-4 sm:px-6 shadow-sm w-full">
      <div className="flex flex-1 items-center gap-4 justify-between w-full">
        {/* Hamburger Menu Button for Mobile */}
        <button
          onClick={onMenuClick}
          className={cn(
            "md:hidden rounded-lg p-2 text-gray-300 hover:bg-primary-light hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2",
            isRTL && "order-last"
          )}
          aria-label={t("aria.openSidebar") || "Open sidebar"}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <h1
          className={cn(
            "text-xl sm:text-2xl font-bold text-accent-yellow",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {t("topbar.logo")}
        </h1>

        <div className="flex items-center gap-3">

          {/* Profile */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-primary-light",
              isRTL && "flex-row"
            )}
          >
            <div
              className={cn(
                "hidden md:block text-white",
                isRTL ? "text-right" : "text-left"
              )}
            >
              <p className="text-sm font-medium">{t("topbar.admin")}</p>
              <p className="text-xs text-gray-400">
                {t("topbar.superAdministrator")}
              </p>
            </div>
            <div
              className={cn(
                "flex flex-row h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white font-semibold",
                isRTL && "order-first"
              )}
            >
              A
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader announcement for language change */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="locale-announcement"
      />
    </header>
  );
}
