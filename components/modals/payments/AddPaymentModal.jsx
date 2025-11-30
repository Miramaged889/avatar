"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { AddPaymentForm } from "../../../forms/AddPaymentForm";
import { useLocale } from "../../utils/useLocale";

export function AddPaymentModal({ open, onOpenChange, onSuccess }) {
  const { t } = useLocale();

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">
          {t("modals.addPayment") || "Add Payment"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("modals.addPaymentDescription") || "Add a new payment"}
        </DialogDescription>
        <AddPaymentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}

