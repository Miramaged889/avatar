"use client";

import { useState, useEffect } from "react";
import { TextInput } from "./form-controls/TextInput";
import { TextareaInput } from "./form-controls/TextareaInput";
import { SelectInput } from "./form-controls/SelectInput";
import { Button } from "../components/shadcn/ButtonWrapper";
import { X } from "lucide-react";
import { useLocale } from "../components/utils/useLocale";
import { useDispatch, useSelector } from "react-redux";
import { editPayment, fetchPaymentDetails } from "../lib/store/slices/paymentSlice";

export function EditPaymentForm({ paymentId, onSuccess, onCancel }) {
  const { t, isRTL } = useLocale();
  const dispatch = useDispatch();
  const { currentPayment, loading } = useSelector((state) => state.payment);

  const [formData, setFormData] = useState({
    amount_paid: "",
    payment_method: "",
    payment_date: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load payment data if editing
  useEffect(() => {
    if (paymentId) {
      if (!currentPayment || currentPayment.id !== paymentId) {
        dispatch(fetchPaymentDetails(paymentId));
      }
    }
  }, [paymentId, dispatch]);

  // Update form when payment data is loaded
  useEffect(() => {
    if (currentPayment && currentPayment.id === paymentId) {
      setFormData({
        amount_paid: currentPayment.amount_paid?.toString() || "",
        payment_method: currentPayment.payment_method || "",
        payment_date: currentPayment.payment_date
          ? new Date(currentPayment.payment_date).toISOString().split("T")[0]
          : "",
        note: currentPayment.note || "",
      });
    }
  }, [currentPayment, paymentId]);

  const paymentMethodOptions = [
    { value: "cash", label: t("payment.methods.cash") || "Cash" },
    { value: "card", label: t("payment.methods.card") || "Card" },
    { value: "bank_transfer", label: t("payment.methods.bankTransfer") || "Bank Transfer" },
    { value: "check", label: t("payment.methods.check") || "Check" },
    { value: "other", label: t("payment.methods.other") || "Other" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const paymentData = {
        ...formData,
        amount_paid: parseFloat(formData.amount_paid) || 0,
      };

      await dispatch(editPayment({ paymentId, paymentData })).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error updating payment:", err);
      const errorMessage =
        err?.detail ||
        err?.message ||
        t("messages.saveFailed") ||
        "Failed to update payment";
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
              {t("modals.editPayment") || "Edit Payment"}
            </h2>
            <p className="text-sm text-gray-500">
              {t("modals.editPaymentDescription") ||
                "Update payment information"}
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
          placeholder={t("placeholders.paymentMethod") || "Select payment method"}
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

