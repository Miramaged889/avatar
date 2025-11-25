"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { SelectInput } from "./form-controls/SelectInput";
import { DatePickerPlaceholder } from "./form-controls/DatePickerPlaceholder";
import { Button } from "../components/shadcn/ButtonWrapper";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/shadcn/AvatarWrapper";
import { Upload, X } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { cn } from "../components/utils/cn";

const packages = [
  { value: "premium", label: "Premium" },
  { value: "basic", label: "Basic" },
  { value: "gold", label: "Gold" },
  { value: "custom", label: "Custom" },
];

const avatars = [
  {
    id: 1,
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    fallback: "A1",
  },
  {
    id: 2,
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maggie",
    fallback: "A2",
  },
  {
    id: 3,
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali",
    fallback: "A3",
  },
  {
    id: 4,
    src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    fallback: "A4",
  },
];

export function AddCustomerForm({ onSuccess, onCancel }) {
  const { t, isRTL } = useLocale();
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    phone: "",
    startDate: "",
    endDate: "",
    package: "",
    devices: "0",
    avatars: [], // now support multiple avatars
    file: null,
  });
  const [selectedAvatars, setSelectedAvatars] = useState([]); // now an array
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep selected avatars in sync if formData.avatars is set externally
  useEffect(() => {
    if (
      !formData.avatars ||
      !Array.isArray(formData.avatars) ||
      formData.avatars.length === 0
    ) {
      setSelectedAvatars([]);
      return;
    }
    // Find all avatar IDs that match the selected sources in formData.avatars
    const foundIds = avatars
      .filter((a) => formData.avatars.includes(a.src))
      .map((a) => a.id);
    setSelectedAvatars(foundIds);
  }, [formData.avatars]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = (avatar) => {
    let updatedAvatars;
    let updatedAvatarSrcs;

    // See if already selected
    if (selectedAvatars.includes(avatar.id)) {
      // remove it
      updatedAvatars = selectedAvatars.filter((id) => id !== avatar.id);
      updatedAvatarSrcs = formData.avatars.filter((src) => src !== avatar.src);
    } else {
      // add it
      updatedAvatars = [...selectedAvatars, avatar.id];
      updatedAvatarSrcs = [...formData.avatars, avatar.src];
    }
    setSelectedAvatars(updatedAvatars);
    handleChange("avatars", updatedAvatarSrcs);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    handleChange("file", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation
    if (
      !formData.nameEn ||
      !formData.nameAr ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert(t("messages.fillRequiredFields"));
      setIsSubmitting(false);
      return;
    }
    // devices number sanity
    const devicesNum = parseInt(formData.devices, 10) || 0;
    if (devicesNum < 0 || devicesNum > 50) {
      alert(t("messages.devicesRange"));
      setIsSubmitting(false);
      return;
    }

    // Simulate API call (replace with real API)
    try {
      await new Promise((res) => setTimeout(res, 800));
      if (onSuccess) onSuccess({ ...formData, devices: String(devicesNum) });
    } catch (err) {
      console.error(err);
      alert(t("messages.saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("modals.addCustomer")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("modals.addCustomerDescription")}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Name - English */}
        <TextInput
          label={t("labels.nameEn")}
          name="nameEn"
          placeholder={t("placeholders.customerNameEn")}
          value={formData.nameEn}
          onChange={(e) => handleChange("nameEn", e.target.value)}
          required
        />
        {/* Customer Name - Arabic */}
        <TextInput
          label={t("labels.nameAr")}
          name="nameAr"
          placeholder={t("placeholders.customerNameAr")}
          value={formData.nameAr}
          onChange={(e) => handleChange("nameAr", e.target.value)}
          required
        />
        {/* Phone Number */}
        <TextInput
          label={t("labels.phone")}
          name="phone"
          type="tel"
          placeholder={t("placeholders.phoneExample")}
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        {/* Start Date and End Date side by side */}
        <div className="flex gap-4">
          <div className="flex-1">
            <DatePickerPlaceholder
              label={t("labels.startDate")}
              name="startDate"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target?.value ?? "")}
              required
            />
          </div>
          <div className="flex-1">
            <DatePickerPlaceholder
              label={t("labels.endDate")}
              name="endDate"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target?.value ?? "")}
              required
            />
          </div>
        </div>
        {/* Package / Plan */}
        <SelectInput
          label={t("labels.package")}
          name="package"
          placeholder={t("placeholders.choosePackage")}
          options={packages}
          value={formData.package}
          onChange={(value) => handleChange("package", value)}
        />
        {/* Number of Devices */}
        <div className="space-y-2">
          <label
            htmlFor="devices"
            className="block text-sm font-medium text-gray-700 text-left"
          >
            {t("labels.devices")}
          </label>
          <input
            id="devices"
            name="devices"
            type="number"
            min="0"
            max="50"
            value={formData.devices}
            onChange={(e) => {
              const v = e.target.value;
              const num = Math.max(0, Math.min(50, Number(v || 0)));
              handleChange("devices", String(isNaN(num) ? 0 : num));
            }}
            placeholder={t("placeholders.devices")}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
          />
        </div>
        {/* Choose the Avatar (now multi-select) */}
        <div className="space-y-3 mt-2">
          <label className="block text-sm font-medium text-gray-700 text-left">
            {t("labels.avatar")}
          </label>
          <div className="flex gap-4 items-center mt-2">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleAvatarClick(avatar)}
                aria-pressed={selectedAvatars.includes(avatar.id)}
                className={cn(
                  "rounded-full transition-all p-1",
                  selectedAvatars.includes(avatar.id)
                    ? "ring-4 ring-primary-default border-2 border-primary-default"
                    : "border-2 border-transparent hover:border-gray-300"
                )}
                style={{
                  boxShadow: selectedAvatars.includes(avatar.id)
                    ? "0 0 0 4px #112CA3"
                    : undefined,
                  transition: "box-shadow 0.2s",
                }}
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatar.src} alt={`Avatar ${avatar.id}`} />
                  <AvatarFallback>{avatar.fallback}</AvatarFallback>
                </Avatar>
              </button>
            ))}
          </div>
          {/* Show selected avatars as chips or preview, optional */}
          {selectedAvatars.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {avatars
                .filter((a) => selectedAvatars.includes(a.id))
                .map((a) => (
                  <div
                    key={`chip-${a.id}`}
                    className="flex items-center px-2 py-1 bg-primary-light rounded-full text-xs font-medium text-white gap-2"
                  >
                    <img
                      src={a.src}
                      alt={`Avatar tiny ${a.id}`}
                      className="h-6 w-6 rounded-full border"
                    />
                    <span>{a.fallback}</span>
                    <button
                      type="button"
                      aria-label="Remove avatar"
                      className="ml-1 text-white hover:text-red-400"
                      onClick={() => handleAvatarClick(a)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Upload Data */}

        <div className="space-y-2 mt-4 w-full">
          <label className="block text-sm font-medium text-gray-900 text-left">
            {t("buttons.uploadData")}
          </label>

          {/* Smaller gray box wrapping all upload content */}
          <div
            className="bg-gray-800 border border-gray-800 p-4 rounded-lg h-64"
            style={{
              borderRadius: "15px",
            }}
          >
            <input
              id="file-upload"
              type="file"
              accept="*/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                handleFileChange?.(e); // call parent handler if exists
              }}
            />
            <div
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer?.files?.[0] ?? null;
                if (f) {
                  // call external handler if provided
                  const fakeEvent = { target: { files: [f] } };
                  handleFileChange?.(fakeEvent);
                  // if you manage locally:
                  // setFormData(prev => ({ ...prev, file: f }))
                }
              }}
              className="relative flex flex-col items-center justify-center w-full px-4 py-8  rounded-lg cursor-pointer"
              style={{
                backgroundColor: "#D4D4D4",
                height: "100%",
                border: "2px solid #D4D4D4",
                borderRadius: "15px",
              }}
              aria-label="File upload area"
            >
              {/* preview or icon */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <div className="text-center mt-1">
                  <p className="text-sm font-medium text-gray-700">
                    {t("messages.chooseFileOrDrag")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("messages.maxFileSize")}
                  </p>
                </div>
              </div>

              {/* Browse button */}
              <div className="mt-4">
                <Button
                  variant="default"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("file-upload")?.click();
                  }}
                  className="px-6 py-2 text-sm font-medium rounded-md"
                >
                  {t("buttons.browseFile")}
                </Button>
              </div>

              {/* Selected file preview area (shows file name + remove) */}
              {formData?.file ? (
                <div className="mt-4 flex items-center gap-3">
                  {formData.file.type?.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="preview"
                      className="h-12 w-12 rounded-md object-cover border"
                    />
                  ) : (
                    <img
                      src="https://ui-avatars.com/api/?name=File&background=EBF4FF&color=1E40AF&size=96"
                      alt="placeholder preview"
                      className="h-12 w-12 rounded-md object-cover border"
                    />
                  )}

                  <div className="text-xs text-gray-700">
                    <div className="font-medium">{formData.file.name}</div>
                    <div className="text-gray-500">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      // clear input visually and state
                      const el = document.getElementById("file-upload");
                      if (el) el.value = "";
                      handleFileChange?.({ target: { files: [] } });
                    }}
                    className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 ml-4"
                    aria-label={t("buttons.remove")}
                  >
                    {t("buttons.remove")}
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                  <span>{t("messages.noFileChosen")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 font-medium py-3"
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            variant="dark"
            className="flex-1 font-medium py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("buttons.saving") : t("buttons.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
