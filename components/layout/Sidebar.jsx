"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Eye, Settings, LogOut, Globe } from "lucide-react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";

const navigation = [
  { name: "navigation.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "navigation.customers", href: "/customers", icon: Eye },
  { name: "navigation.settings", href: "/settings", icon: Settings },
  { name: "navigation.logout", href: "/logout", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale, isRTL } = useLocale();

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
    <aside
      className={cn(
        "fixed top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-primary-dark",
        isRTL ? "right-0" : "left-0"
      )}
    >
      <div className="flex h-full flex-col">
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

        {/* Language Toggle */}
        <div className="border-t border-primary-light p-4">
          <button
            onClick={toggleLanguage}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mx-2",
              "text-gray-300 hover:bg-primary-light hover:text-white",
              isRTL && "flex-row-reverse"
            )}
            aria-label={t("aria.languageToggle")}
            title={t("aria.languageToggle")}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <div
              className="flex-1 text-left"
              style={isRTL ? { textAlign: "right" } : { textAlign: "left" }}
            >
              <p className="text-sm font-medium text-white">
                {locale === "en" ? "English" : "العربية"}
              </p>
              <p className="text-xs text-gray-400">
                {locale === "en"
                  ? "Switch to Arabic"
                  : "التبديل إلى الإنجليزية"}
              </p>
            </div>
          </button>
        </div>

        {/* Admin Section */}
        <div className="border-t border-primary-light p-4">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3",
              isRTL && "flex-row"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-semibold">
              {locale === "ar" ? "م" : "A"}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {t("sidebar.admin")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
