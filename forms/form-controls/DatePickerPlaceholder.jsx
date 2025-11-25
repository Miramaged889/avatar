"use client";

import { useLocale } from "../../components/utils/useLocale";
import { cn } from "../../components/utils/cn";

export function DatePickerPlaceholder({
  label,
  name,
  value,
  onChange,
  required = false,
  className,
  ...props
}) {
  const { t, isRTL } = useLocale();

  // Ensure name exists for htmlFor
  const inputId =
    name || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

  // Format value for input type="date" (YYYY-MM-DD)
  const dateValue = (() => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    // Try to parse and format if it's in a different format
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    }
    return "";
  })();

  const handleChange = (e) => {
    const dateString = e.target.value; // Already in YYYY-MM-DD format
    // Emit object that looks like an event to keep current usage
    onChange && onChange({ target: { name, value: dateString } });
  };

  // Translate if needed
  const displayLabel =
    typeof label === "string" && label.startsWith("labels.") ? t(label) : label;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 text-left"
        >
          {displayLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type="date"
        value={dateValue}
        onChange={handleChange}
        required={required}
        className={cn(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 text-left",
          "focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
        )}
        {...props}
      />
    </div>
  );
}
