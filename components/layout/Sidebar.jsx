"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Eye,
  Settings,
  LogOut,
  Globe,
  X,
  Users,
  BookOpen,
  CreditCard,
  Shield,
} from "lucide-react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";
import { useEffect } from "react";

const navigation = [
  { name: "navigation.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "navigation.business", href: "/business", icon: Eye },
  { name: "navigation.knowledge", href: "/knowledge", icon: BookOpen },
  { name: "navigation.settings", href: "/settings", icon: Settings },
  { name: "navigation.logout", href: "/logout", icon: LogOut },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale, isRTL } = useLocale();

  // Close sidebar when clicking on a link on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    setLocale(newLocale);
    // Refresh the page to apply all changes
    setTimeout(() => {
      router.refresh();
      window.location.reload();
    }, 100);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-primary-dark transition-transform duration-300 ease-in-out",
          isRTL ? "right-0" : "left-0",
          // Hide on mobile by default, show when isOpen is true
          isOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full md:translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Close Button for Mobile */}
          <div
            className={cn(
              "flex p-4 md:hidden",
              isRTL ? "justify-start" : "justify-end"
            )}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
              aria-label={t("aria.closeSidebar") || "Close sidebar"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors relative",
                    isActive
                      ? isRTL
                        ? "bg-white text-primary-dark rounded-r-lg rounded-l-none mr-2"
                        : "bg-white text-primary-dark rounded-l-lg rounded-r-none ml-2"
                      : "text-gray-300 hover:bg-primary-light hover:text-white rounded-lg mx-2"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center",
                      isActive
                        ? "bg-accent-yellow text-primary-dark rounded-full h-8 w-8"
                        : ""
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>{t(item.name)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle (Improved UI) */}
          <div className="border-t border-primary-light px-4 py-4">
            <button
              onClick={toggleLanguage}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all",
                "bg-primary-light/40 hover:bg-primary-light/70",
                "text-white group shadow-sm",
                isRTL && "flex-row"
              )}
              aria-label={t("aria.languageToggle")}
              title={t("aria.languageToggle")}
              style={{ minHeight: 48 }}
            >
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-dark shadow transition-all group-hover:bg-accent-yellow">
                <Globe className="h-5 w-5 text-white group-hover:text-primary-dark" />
              </div>
              <div
                className={cn(
                  "flex-1 flex flex-col justify-center",
                  isRTL ? "items-start text-left" : "items-start text-left"
                )}
              >
                <span className="text-base font-semibold text-white">
                  {locale === "en" ? "English" : "العربية"}
                </span>
                <span className="text-xs text-gray-200 group-hover:text-white transition-colors">
                  {locale === "en"
                    ? "Switch to Arabic"
                    : "التبديل إلى الإنجليزية"}
                </span>
              </div>
            </button>
          </div>

          {/* Admin Section (Improved UI) */}
          <div className="border-t border-primary-light px-4 py-4">
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl bg-primary-light/40 px-3 py-2",
                isRTL ? "flex-row" : "flex-row"
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 shadow text-white text-base font-bold border-2 border-white">
                {locale === "ar" ? "م" : "A"}
              </div>
              <div className={cn("flex-1", isRTL ? "text-left" : "text-left")}>
                <span className="text-base font-semibold text-white">
                  {t("sidebar.admin")}
                </span>
                <div className="text-xs text-gray-200 group-hover:text-white transition-colors">
                  {t("navigation.adminRole") || "Administrator"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
