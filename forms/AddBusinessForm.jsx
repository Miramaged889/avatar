"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { X } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { useDispatch, useSelector } from "react-redux";
import {
  addBusiness,
  editBusiness,
  fetchBusinessDetails,
} from "../lib/store/slices/businessSlice";

const categories = [
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Services" },
];

export function AddBusinessForm({ businessId = null, onSuccess, onCancel }) {
  const { t, isRTL } = useLocale();
  const dispatch = useDispatch();
  const { currentBusiness, loading } = useSelector((state) => state.business);

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    legal_name_en: "",
    legal_name_ar: "",
    tax_number: "",
    commercial_register_number: "",
    domain_url: "",
    country: "",
    city: "",
    address: "",
    category: "",
    max_admins: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load business data if editing
  useEffect(() => {
    if (businessId) {
      // Fetch business details if not already loaded or if different business
      if (!currentBusiness || currentBusiness.id !== businessId) {
        dispatch(fetchBusinessDetails(businessId));
      }
    }
  }, [businessId, dispatch]);

  // Update form when business data is loaded
  useEffect(() => {
    if (
      businessId &&
      currentBusiness &&
      String(currentBusiness.id) === String(businessId)
    ) {
      setFormData({
        name_en: currentBusiness.name_en || "",
        name_ar: currentBusiness.name_ar || "",
        legal_name_en: currentBusiness.legal_name_en || "",
        legal_name_ar: currentBusiness.legal_name_ar || "",
        tax_number: currentBusiness.tax_number || "",
        commercial_register_number:
          currentBusiness.commercial_register_number || "",
        domain_url: currentBusiness.domain_url || "",
        country: currentBusiness.country || "",
        city: currentBusiness.city || "",
        address: currentBusiness.address || "",
        category: currentBusiness.category || "",
        max_admins: currentBusiness.max_admins || 10,
      });
    }
  }, [businessId, currentBusiness]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation
    if (!formData.name_en || !formData.name_ar) {
      alert(
        t("messages.fillRequiredFields") || "Please fill all required fields"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
      };

      if (businessId) {
        // Update existing business
        const result = await dispatch(
          editBusiness({ businessId, businessData: submitData })
        ).unwrap();
        if (onSuccess) onSuccess(result);
      } else {
        // Create new business
        const result = await dispatch(addBusiness(submitData)).unwrap();
        if (onSuccess) onSuccess(result);
      }
    } catch (err) {
      console.error("Error saving business:", err);
      alert(
        err?.message || t("messages.saveFailed") || "Failed to save business"
      );
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
              {businessId
                ? t("modals.editBusiness") || "Edit Business"
                : t("modals.addBusiness") || "Add Business"}
            </h2>
            <p className="text-sm text-gray-500">
              {businessId
                ? t("modals.editBusinessDescription") ||
                  "Update business information"
                : t("modals.addBusinessDescription") ||
                  "Fill the information below to add a new business"}
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
        {/* Name - English */}
        <TextInput
          label={t("labels.nameEn") || "Name (English)"}
          name="name_en"
          placeholder={
            t("placeholders.businessNameEn") || "Enter business name in English"
          }
          value={formData.name_en}
          onChange={(e) => handleChange("name_en", e.target.value)}
          required
        />

        {/* Name - Arabic */}
        <TextInput
          label={t("labels.nameAr") || "Name (Arabic)"}
          name="name_ar"
          placeholder={
            t("placeholders.businessNameAr") || "Enter business name in Arabic"
          }
          value={formData.name_ar}
          onChange={(e) => handleChange("name_ar", e.target.value)}
          required
        />

        {/* Legal Name - English */}
        <TextInput
          label={t("labels.legalNameEn") || "Legal Name (English)"}
          name="legal_name_en"
          placeholder={
            t("placeholders.legalNameEn") || "Enter legal name in English"
          }
          value={formData.legal_name_en}
          onChange={(e) => handleChange("legal_name_en", e.target.value)}
        />

        {/* Legal Name - Arabic */}
        <TextInput
          label={t("labels.legalNameAr") || "Legal Name (Arabic)"}
          name="legal_name_ar"
          placeholder={
            t("placeholders.legalNameAr") || "Enter legal name in Arabic"
          }
          value={formData.legal_name_ar}
          onChange={(e) => handleChange("legal_name_ar", e.target.value)}
        />

        {/* Tax Number and Commercial Register Number */}
        <div className="flex gap-4">
          <div className="flex-1">
            <TextInput
              label={t("labels.taxNumber") || "Tax Number"}
              name="tax_number"
              placeholder={t("placeholders.taxNumber") || "Enter tax number"}
              value={formData.tax_number}
              onChange={(e) => handleChange("tax_number", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <TextInput
              label={
                t("labels.commercialRegister") || "Commercial Register Number"
              }
              name="commercial_register_number"
              placeholder={
                t("placeholders.commercialRegister") ||
                "Enter commercial register number"
              }
              value={formData.commercial_register_number}
              onChange={(e) =>
                handleChange("commercial_register_number", e.target.value)
              }
            />
          </div>
        </div>

        {/* Domain URL */}
        <TextInput
          label={t("labels.domainUrl") || "Domain URL"}
          name="domain_url"
          type="url"
          placeholder={t("placeholders.domainUrl") || "https://www.example.com"}
          value={formData.domain_url}
          onChange={(e) => handleChange("domain_url", e.target.value)}
        />

        {/* Country and City */}
        <div className="flex gap-4">
          <div className="flex-1">
            <TextInput
              label={t("labels.country") || "Country"}
              name="country"
              placeholder={t("placeholders.country") || "Enter country"}
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <TextInput
              label={t("labels.city") || "City"}
              name="city"
              placeholder={t("placeholders.city") || "Enter city"}
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
        </div>

        {/* Address */}
        <TextInput
          label={t("labels.address") || "Address"}
          name="address"
          placeholder={t("placeholders.address") || "Enter full address"}
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        {/* Category and Max Admins */}
        <div className="flex gap-4">
          <div className="flex-1">
            <SelectInput
              label={t("labels.category") || "Category"}
              name="category"
              placeholder={
                t("placeholders.chooseCategory") || "Choose category"
              }
              options={categories}
              value={formData.category}
              onChange={(value) => handleChange("category", value)}
            />
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              <label
                htmlFor="max_admins"
                className="block text-sm font-medium text-gray-700 text-left"
              >
                {t("labels.maxAdmins") || "Max Admins"}
              </label>
              <input
                id="max_admins"
                name="max_admins"
                type="number"
                min="1"
                max="100"
                value={formData.max_admins}
                onChange={(e) => {
                  const v = e.target.value;
                  const num = Math.max(1, Math.min(100, Number(v || 1)));
                  handleChange("max_admins", isNaN(num) ? 1 : num);
                }}
                placeholder={t("placeholders.maxAdmins") || "Enter max admins"}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
              />
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
            disabled={isSubmitting || loading}
          >
            {t("buttons.cancel") || "Cancel"}
          </Button>
          <Button
            type="submit"
            variant="dark"
            className="flex-1 font-medium py-3"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading
              ? t("buttons.saving") || "Saving..."
              : t("buttons.save") || "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
