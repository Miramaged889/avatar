"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { TextareaInput } from "./form-controls/TextareaInput";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { X } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { useDispatch, useSelector } from "react-redux";
import { addPayment } from "../lib/store/slices/paymentSlice";
import { fetchAllBusinesses } from "../lib/store/slices/businessSlice";

export function AddPaymentForm({ onSuccess, onCancel, businessId = null }) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { loading: paymentLoading } = useSelector((state) => state.payment);
  const { businesses, loading: businessesLoading } = useSelector(
    (state) => state.business
  );

  const [formData, setFormData] = useState({
    business_id: businessId ? String(businessId) : "",
    amount_paid: "",
    payment_method: "",
    payment_date: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch businesses on mount
  useEffect(() => {
    if (businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch, businesses.length]);

  // Set business_id if provided (always update when businessId changes)
  useEffect(() => {
    if (businessId) {
      setFormData((prev) => ({
        ...prev,
        business_id: String(businessId),
      }));
    }
  }, [businessId]);

  const paymentMethodOptions = [
    { value: "cash", label: t("payment.methods.cash") || "Cash" },
    { value: "credit_card", label: t("payment.methods.card") || "Credit Card" },
    {
      value: "bank_transfer",
      label: t("payment.methods.bankTransfer") || "Bank Transfer",
    },
  ];

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
    if (
      !formData.business_id ||
      !formData.amount_paid ||
      !formData.payment_method ||
      !formData.payment_date
    ) {
      alert(
        t("messages.fillRequiredFields") || "Please fill all required fields"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const paymentData = {
        business_id: Number(formData.business_id), // Convert to number as API expects
        amount_paid: parseFloat(formData.amount_paid) || 0,
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
        note: formData.note || "",
      };

      await dispatch(addPayment(paymentData)).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating payment:", err);
      const errorMessage =
        err?.detail ||
        err?.message ||
        t("messages.saveFailed") ||
        "Failed to create payment";
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
              {t("modals.addPayment") || "Add Payment"}
            </h2>
            <p className="text-sm text-gray-500">
              {t("modals.addPaymentDescription") ||
                "Fill the information below to add a new payment"}
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
          disabled={businessesLoading || !!businessId}
        />

        {/* Amount Paid */}
        <TextInput
          label={t("labels.amountPaid") || "Amount Paid"}
          name="amount_paid"
          type="number"
          placeholder={t("placeholders.amountPaid") || "Enter amount"}
          value={formData.amount_paid}
          onChange={(e) => handleChange("amount_paid", e.target.value)}
          required
          step="0.01"
        />

        {/* Payment Method */}
        <SelectInput
          label={t("labels.paymentMethod") || "Payment Method"}
          name="payment_method"
          placeholder={
            t("placeholders.paymentMethod") || "Select payment method"
          }
          options={paymentMethodOptions}
          value={formData.payment_method}
          onChange={(value) => handleChange("payment_method", value)}
          required
        />

        {/* Payment Date */}
        <TextInput
          label={t("labels.paymentDate") || "Payment Date"}
          name="payment_date"
          type="date"
          placeholder={t("placeholders.paymentDate") || "Select date"}
          value={formData.payment_date}
          onChange={(e) => handleChange("payment_date", e.target.value)}
          required
        />

        {/* Note */}
        <TextareaInput
          label={t("labels.note") || "Note"}
          name="note"
          placeholder={t("placeholders.note") || "Enter note (optional)"}
          value={formData.note}
          onChange={(e) => handleChange("note", e.target.value)}
          rows={4}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 font-medium py-3"
              disabled={isSubmitting || paymentLoading || businessesLoading}
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>
          )}
          <Button
            type="submit"
            variant="dark"
            className="flex-1 font-medium py-3"
            disabled={isSubmitting || paymentLoading || businessesLoading}
          >
            {isSubmitting || paymentLoading
              ? t("buttons.saving") || "Saving..."
              : t("buttons.save") || "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

