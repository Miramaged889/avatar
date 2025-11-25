"use client";

import { useState, useEffect, useCallback } from "react";
import enLocale from "../../locales/en.json";
import arLocale from "../../locales/ar.json";

const locales = {
  en: enLocale,
  ar: arLocale,
};

const STORAGE_KEY = "locale";

export function useLocale() {
  const [locale, setLocaleState] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  // Apply locale to document
  const applyLocale = useCallback((newLocale) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
      // Use RTL for Arabic, LTR for English
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";

      // Switch font family
      const root = document.documentElement;
      if (newLocale === "ar") {
        root.classList.add("font-arabic");
        root.classList.remove("font-sans");
      } else {
        root.classList.add("font-sans");
        root.classList.remove("font-arabic");
      }
    }
  }, []);

  // Initialize locale from localStorage or default to 'en'
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem(STORAGE_KEY) || "en";
      setLocaleState(savedLocale);
      applyLocale(savedLocale);
      setIsLoading(false);
    }
  }, [applyLocale]);

  // Set locale and persist
  const setLocale = useCallback(
    (newLocale) => {
      if (newLocale !== locale && (newLocale === "en" || newLocale === "ar")) {
        setLocaleState(newLocale);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, newLocale);
          applyLocale(newLocale);

          // Announce language change for screen readers
          const announcement = document.createElement("div");
          announcement.setAttribute("aria-live", "polite");
          announcement.setAttribute("aria-atomic", "true");
          announcement.className = "sr-only";
          announcement.textContent = `Language changed to ${
            newLocale === "en" ? "English" : "Arabic"
          }`;
          document.body.appendChild(announcement);
          setTimeout(() => {
            document.body.removeChild(announcement);
          }, 1000);
        }
      }
    },
    [locale, applyLocale]
  );

  // Translation function
  const t = useCallback(
    (key, fallback = "") => {
      const keys = key.split(".");
      let value = locales[locale];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          if (locale !== "en") {
            console.warn(
              `Translation missing for key: ${key} in locale: ${locale}`
            );
            // Fallback to English
            value = locales.en;
            for (const k2 of keys) {
              if (value && typeof value === "object" && k2 in value) {
                value = value[k2];
              } else {
                return fallback || key;
              }
            }
          } else {
            return fallback || key;
          }
        }
      }

      return typeof value === "string" ? value : fallback || key;
    },
    [locale]
  );

  // Format date according to locale
  const formatDate = useCallback(
    (date, options = {}) => {
      if (!date) return "";
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "";

      const defaultOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
        ...defaultOptions,
        ...options,
      }).format(dateObj);
    },
    [locale]
  );

  // Format number according to locale
  const formatNumber = useCallback(
    (number, options = {}) => {
      if (typeof number !== "number") return number;
      return new Intl.NumberFormat(
        locale === "ar" ? "ar-SA" : "en-US",
        options
      ).format(number);
    },
    [locale]
  );

  return {
    locale,
    setLocale,
    t,
    formatDate,
    formatNumber,
    isLoading,
    isRTL: locale === "ar", // RTL for Arabic, LTR for English
  };
}
