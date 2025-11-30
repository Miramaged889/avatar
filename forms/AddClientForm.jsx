"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { X } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { useDispatch, useSelector } from "react-redux";
import {
  addClient,
  editClient,
  fetchClientDetails,
} from "../lib/store/slices/clientSlice";
import { fetchAllBusinesses } from "../lib/store/slices/businessSlice";

export function AddClientForm({ clientId = null, onSuccess, onCancel }) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { currentClient, loading: clientLoading } = useSelector(
    (state) => state.client
  );
  const { businesses, loading: businessesLoading } = useSelector(
    (state) => state.business
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch businesses on mount
  useEffect(() => {
    if (!businesses || businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch, businesses]);

  // Load client data if editing
  useEffect(() => {
    if (clientId) {
      if (!currentClient || currentClient.id !== parseInt(clientId)) {
        dispatch(fetchClientDetails(clientId));
      }
    }
  }, [clientId, dispatch]);

  // Update form when client data is loaded
  useEffect(() => {
    if (
      clientId &&
      currentClient &&
      String(currentClient.id) === String(clientId)
    ) {
      setFormData({
        name: currentClient.name || "",
        email: currentClient.email || "",
        phone: currentClient.phone || "",
        business_id: currentClient.business || currentClient.business_id || "",
      });
    }
  }, [clientId, currentClient]);

  // Prepare business options for dropdown
  const businessOptions = (
    businesses && Array.isArray(businesses) ? businesses : []
  ).map((business) => ({
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

    // Basic Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      (!formData.business_id && !clientId) // business_id only required when creating
    ) {
      alert(
        t("messages.fillRequiredFields") || "Please fill all required fields"
      );
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert(t("messages.invalidEmail") || "Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      if (clientId) {
        // Update existing client - DO NOT include business_id in PATCH request
        // According to API docs, PATCH only includes updatable fields (name, email, phone)
        // The API preserves the original business_id automatically
        const submitData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          // business_id is NOT included - API preserves the original value
        };

        const result = await dispatch(
          editClient({ clientId, clientData: submitData })
        ).unwrap();
        if (onSuccess) onSuccess(result);
      } else {
        // Create new client - include business_id
        const submitData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business_id: String(formData.business_id),
        };
        const result = await dispatch(addClient(submitData)).unwrap();
        if (onSuccess) onSuccess(result);
      }
    } catch (err) {
      console.error("Error saving client:", err);

      // Better error handling - parse API error response
      let errorMessage = t("messages.saveFailed") || "Failed to save client";

      if (err) {
        // Handle error object with field-specific errors
        if (typeof err === "object") {
          const errors = [];
          Object.keys(err).forEach((key) => {
            const fieldError = err[key];
            if (typeof fieldError === "string") {
              errors.push(fieldError);
            } else if (Array.isArray(fieldError)) {
              errors.push(...fieldError);
            }
          });
          if (errors.length > 0) {
            errorMessage = errors.join("\n");
          } else if (err.detail) {
            errorMessage = err.detail;
          } else if (err.message) {
            errorMessage = err.message;
          }
        } else if (typeof err === "string") {
          errorMessage = err;
        }
      }

      alert(errorMessage);
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
              {clientId
                ? t("modals.editClient") || "Edit Client"
                : t("modals.addClient") || "Add Client"}
            </h2>
            <p className="text-sm text-gray-500">
              {clientId
                ? t("modals.editClientDescription") ||
                  "Update client information"
                : t("modals.addClientDescription") ||
                  "Fill the information below to add a new client"}
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
        {/* Name */}
        <TextInput
          label={t("labels.clientName") || "Client Name"}
          name="name"
          placeholder={t("placeholders.clientName") || "Enter client name"}
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
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

        {/* Phone */}
        <TextInput
          label={t("labels.phone") || "Phone"}
          name="phone"
          type="tel"
          placeholder={t("placeholders.phoneExample") || "Enter phone number"}
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />

        {/* Business Dropdown */}
        <div>
          <SelectInput
            label={t("labels.business") || "Business"}
            name="business_id"
            placeholder={
              businessesLoading
                ? t("messages.loading") || "Loading..."
                : t("placeholders.chooseBusiness") || "Choose business"
            }
            options={businessOptions}
            value={
              formData.business_id ? String(formData.business_id) : undefined
            }
            onChange={(value) => handleChange("business_id", value)}
            disabled={businessesLoading || !!clientId} // Disable when editing - can't change business
            required={!clientId} // Only required when adding new client
          />
          {clientId && (
            <p className="mt-1 text-xs text-gray-500">
              {t("messages.businessCannotChange") ||
                "Business cannot be changed for existing clients"}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 font-medium py-3"
            disabled={isSubmitting || clientLoading}
          >
            {t("buttons.cancel") || "Cancel"}
          </Button>
          <Button
            type="submit"
            variant="dark"
            className="flex-1 font-medium py-3"
            disabled={isSubmitting || clientLoading || businessesLoading}
          >
            {isSubmitting || clientLoading
              ? t("buttons.saving") || "Saving..."
              : t("buttons.save") || "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
