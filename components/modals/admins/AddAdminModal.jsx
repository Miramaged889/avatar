"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { AddAdminForm } from "../../../forms/AddAdminForm";
import { useLocale } from "../../utils/useLocale";

export function AddAdminModal({ open, onOpenChange, onSuccess }) {
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
          {t("modals.addAdmin") || "Add Admin"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("modals.addAdminDescription") || "Add a new admin"}
        </DialogDescription>
        <AddAdminForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}

