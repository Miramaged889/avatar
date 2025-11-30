"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { X } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { useDispatch, useSelector } from "react-redux";
import { editAdmin, fetchAllAdmins } from "../lib/store/slices/adminSlice";

export function EditAdminForm({ adminId, onSuccess, onCancel }) {
  const { t, isRTL } = useLocale();
  const dispatch = useDispatch();
  const { admins, loading } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load admin data if editing
  useEffect(() => {
    if (adminId) {
      const admin = admins.find((a) => a.id === adminId);
      if (admin) {
        setFormData({
          full_name: admin.full_name || "",
          email: admin.email || "",
        });
      } else {
        // If admin not found in list, fetch all admins
        dispatch(fetchAllAdmins());
      }
    }
  }, [adminId, admins, dispatch]);

  // Update form when admin data is loaded
  useEffect(() => {
    if (adminId && admins.length > 0) {
      const admin = admins.find((a) => a.id === adminId);
      if (admin) {
        setFormData({
          full_name: admin.full_name || "",
          email: admin.email || "",
        });
      }
    }
  }, [adminId, admins]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.full_name || !formData.email) {
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

    try {
      const adminData = {
        id: adminId,
        full_name: formData.full_name,
        email: formData.email,
      };

      await dispatch(editAdmin(adminData)).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error updating admin:", err);
      const errorMessage =
        err?.detail ||
        err?.message ||
        t("messages.saveFailed") ||
        "Failed to update admin";
      alert(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
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
              {t("modals.editAdmin") || "Edit Admin"}
            </h2>
            <p className="text-sm text-gray-500">
              {t("modals.editAdminDescription") ||
                "Update admin information"}
            </p>
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 font-medium py-3"
              disabled={isSubmitting || loading}
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>
          )}
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

