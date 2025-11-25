"use client";

import { useLocale } from "../../components/utils/useLocale";
import { cn } from "../../components/utils/cn";

export function TextInput({
  label,
  name,
  placeholder,
  required = false,
  type = "text",
  value,
  onChange,
  className,
  ...props
}) {
  const { t, isRTL } = useLocale();

  // Translate if needed
  const displayLabel =
    typeof label === "string" && label.startsWith("labels.") ? t(label) : label;
  const displayPlaceholder =
    typeof placeholder === "string" && placeholder.startsWith("placeholders.")
      ? t(placeholder)
      : placeholder;

  // Ensure name exists for htmlFor
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 text-left"
        >
          {displayLabel}
          {!required && (
            <span className="text-gray-500 font-normal"> (Optional)</span>
          )}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={displayPlaceholder}
        value={value}
        onChange={onChange}
        required={required}
        className={cn(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 text-left",
          "focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent",
          "disabled:bg-gray-50 disabled:text-gray-500"
        )}
        {...props}
      />
    </div>
  );
}
