"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { X } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { useDispatch, useSelector } from "react-redux";
import { addAdmin, fetchAllAdmins } from "../lib/store/slices/adminSlice";
import { fetchAllBusinesses, fetchBusinessDetails } from "../lib/store/slices/businessSlice";

export function AddAdminForm({ onSuccess, onCancel }) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { loading: adminLoading, admins } = useSelector((state) => state.admin);
  const { businesses, loading: businessesLoading } = useSelector(
    (state) => state.business
  );
  const { currentBusiness } = useSelector((state) => state.business);

  const [formData, setFormData] = useState({
    business_id: "",
    full_name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxAdmins, setMaxAdmins] = useState(null);
  const [currentAdminsCount, setCurrentAdminsCount] = useState(0);

  // Fetch businesses on mount
  useEffect(() => {
    if (businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch, businesses.length]);

  // Fetch business details and admins when business is selected to get max_admins
  useEffect(() => {
    if (formData.business_id) {
      dispatch(fetchBusinessDetails(formData.business_id));
      // Fetch admins for this specific business to get accurate count
      dispatch(fetchAllAdmins({ business: formData.business_id }));
    }
  }, [formData.business_id, dispatch]);

  // Update max_admins when business details are loaded
  useEffect(() => {
    if (currentBusiness && currentBusiness.id === Number(formData.business_id)) {
      setMaxAdmins(currentBusiness.max_admins || null);
    }
  }, [currentBusiness, formData.business_id]);

  // Calculate current admins count for selected business
  useEffect(() => {
    if (formData.business_id && admins.length > 0) {
      const businessId = Number(formData.business_id);
      const count = admins.filter(
        (admin) => admin.business === businessId
      ).length;
      setCurrentAdminsCount(count);
    } else {
      setCurrentAdminsCount(0);
    }
  }, [formData.business_id, admins]);

  const businessOptions = businesses.map((business) => ({
    value: String(business.id),
    label:
      locale === "ar" && business.name_ar
        ? business.name_ar
        : business.name_en || `Business #${business.id}`,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.business_id || !formData.full_name || !formData.email || !formData.password) {
      alert(
        t("messages.fillRequiredFields") || "Please fill all required fields"
      );
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert(t("messages.invalidEmail") || "Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      alert(t("messages.passwordMinLength") || "Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    // Check max_admins limit
    if (maxAdmins !== null && currentAdminsCount >= maxAdmins) {
      alert(
        t("messages.maxAdminsReached", { max: maxAdmins }) ||
          `Maximum number of admins (${maxAdmins}) has been reached for this business.`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const adminData = {
        business: Number(formData.business_id),
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      };

      await dispatch(addAdmin(adminData)).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating admin:", err);
      
      // Handle API validation errors
      let errorMessage = t("messages.saveFailed") || "Failed to create admin";
      
      if (err?.business) {
        errorMessage = Array.isArray(err.business) 
          ? `Business: ${err.business.join(", ")}` 
          : `Business: ${err.business}`;
      } else if (err?.password) {
        errorMessage = Array.isArray(err.password) 
          ? `Password: ${err.password.join(", ")}` 
          : `Password: ${err.password}`;
      } else if (err?.detail) {
        errorMessage = typeof err.detail === "string" 
          ? err.detail 
          : Array.isArray(err.detail) 
            ? err.detail.join(", ") 
            : JSON.stringify(err.detail);
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we can add more admins
  const canAddAdmin = maxAdmins === null || currentAdminsCount < maxAdmins;
  const remainingAdmins = maxAdmins !== null ? maxAdmins - currentAdminsCount : null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("modals.addAdmin") || "Add Admin"}
            </h2>
            <p className="text-sm text-gray-500">
              {t("modals.addAdminDescription") ||
                "Fill the information below to add a new admin"}
            </p>
            {maxAdmins !== null && (
              <p className="text-xs text-gray-600 mt-2">
                {t("admin.maxAdminsInfo", { max: maxAdmins, remaining: remainingAdmins }) ||
                  `Max admins: ${maxAdmins}, Remaining: ${remainingAdmins}`}
              </p>
            )}
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="ml-4 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Selection */}
        <SelectInput
          label={t("labels.business") || "Business"}
          name="business_id"
          placeholder={
            businessesLoading
              ? t("messages.loading") || "Loading..."
              : t("placeholders.chooseBusiness") || "Choose business"
          }
          options={businessOptions}
          value={formData.business_id ? String(formData.business_id) : ""}
          onChange={(value) => handleChange("business_id", value)}
          required
          disabled={businessesLoading}
        />

        {/* Full Name */}
        <TextInput
          label={t("labels.fullName") || "Full Name"}
          name="full_name"
          placeholder={t("placeholders.fullName") || "Enter full name"}
          value={formData.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          required
        />

        {/* Email */}
        <TextInput
          label={t("labels.email") || "Email"}
          name="email"
          type="email"
          placeholder={t("placeholders.email") || "Enter email address"}
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />

        {/* Password */}
        <TextInput
          label={t("labels.password") || "Password"}
          name="password"
          type="password"
          placeholder={t("placeholders.password") || "Enter password"}
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          minLength={6}
        />

        {/* Warning if max admins reached */}
        {maxAdmins !== null && !canAddAdmin && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            {t("messages.maxAdminsReached", { max: maxAdmins }) ||
              `Maximum number of admins (${maxAdmins}) has been reached for this business.`}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 font-medium py-3"
              disabled={isSubmitting || adminLoading || businessesLoading}
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>
          )}
          <Button
            type="submit"
            variant="dark"
            className="flex-1 font-medium py-3"
            disabled={isSubmitting || adminLoading || businessesLoading || !canAddAdmin}
          >
            {isSubmitting || adminLoading
              ? t("buttons.saving") || "Saving..."
              : t("buttons.save") || "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

