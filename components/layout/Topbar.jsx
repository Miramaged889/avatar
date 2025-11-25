"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";

export function Topbar() {
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
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center gap-4  bg-primary-dark px-6 shadow-sm w-full">
      <div className="flex flex-1 items-center gap-4 justify-between w-full">
        {/* Logo */}
        <h1
          className={cn(
            "text-2xl font-bold text-accent-yellow",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {t("topbar.logo")}
        </h1>
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className={cn(
              "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
              isRTL ? "right-3" : "left-3"
            )}
          />
          <input
            type="text"
            placeholder={t("placeholders.search")}
            className={cn(
              "w-full rounded-lg border border-gray-600 bg-primary-light py-2 text-sm text-white placeholder-gray-400 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/20",
              isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
            )}
            aria-label={t("aria.search")}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 text-gray-300 hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2"
            aria-label={t("aria.notifications")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-primary-light",
              isRTL && "flex-row-reverse"
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 text-white font-semibold">
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
