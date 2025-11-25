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
        value={value}
        onValueChange={(v) => onChange && onChange(v)}
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
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
