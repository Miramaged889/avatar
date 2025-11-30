"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/shadcn/SelectWrapper";
import { useLocale } from "../../components/utils/useLocale";
import { cn } from "../../components/utils/cn";
import { useMemo } from "react";

export function SelectInput({
  label,
  name,
  placeholder,
  options = [],
  value,
  onChange,
  required = false,
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
  const inputId = name || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Normalize value to always be a string (never null or undefined)
  // This ensures the Select is always controlled from the first render
  // Radix UI Select requires a string value to be controlled (undefined = uncontrolled)
  const normalizedValue = useMemo(() => {
    // For Radix UI Select, we need to always provide a string value for controlled state
    // undefined = uncontrolled, so we use empty string instead
    if (value === null || value === undefined) {
      return ""; // Use empty string instead of undefined for controlled state
    }
    // Convert to string to ensure consistent type
    const stringValue = String(value);
    // Return the string value - this ensures controlled state
    return stringValue;
  }, [value]);

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
      <Select
        value={normalizedValue}
        onValueChange={(v) => {
          // Normalize the value before passing to onChange
          // Convert empty string to undefined for parent component
          const normalizedV =
            v === null || v === "" || v === undefined ? undefined : String(v);
          onChange && onChange(normalizedV);
        }}
        {...props}
      >
        <SelectTrigger
          id={inputId}
          name={name}
          className="w-full border-gray-300 bg-white text-gray-900 text-left"
        >
          <SelectValue placeholder={displayPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((option) => option.value !== "")
            .map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
