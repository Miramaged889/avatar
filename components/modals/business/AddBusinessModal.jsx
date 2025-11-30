"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { AddBusinessForm } from "../../../forms/AddBusinessForm";

export function AddBusinessModal({
  open,
  onOpenChange,
  onSuccess,
  businessId = null,
}) {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">
          {businessId ? "Edit Business" : "Add New Business"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {businessId
            ? "Update business information"
            : "Fill the information below to add a new business"}
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
