"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { EditPaymentForm } from "../../../forms/EditPaymentForm";
import { useLocale } from "../../utils/useLocale";

export function EditPaymentModal({
  open,
  onOpenChange,
  onSuccess,
  paymentId = null,
}) {
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
          {t("modals.editPayment") || "Edit Payment"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("modals.editPaymentDescription") || "Update payment information"}
        </DialogDescription>
        {paymentId && (
          <EditPaymentForm
            paymentId={paymentId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

