"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { AddBusinessForm } from "../../../forms/AddBusinessForm";
import { useLocale } from "../../utils/useLocale";

export function AddBusinessModal({
  open,
  onOpenChange,
  onSuccess,
  businessId = null,
}) {
  const { t } = useLocale();

  const handleSuccess = (data) => {
    if (onSuccess) {
      onSuccess(data);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogTitle className="sr-only">
          {businessId
            ? t("modals.editBusiness") || "Edit Business"
            : t("modals.addBusiness") || "Add Business"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {businessId
            ? t("modals.editBusinessDescription") ||
              "Update business information"
            : t("modals.addBusinessDescription") ||
              "Fill the information below to add a new business"}
        </DialogDescription>
        <AddBusinessForm
          businessId={businessId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
