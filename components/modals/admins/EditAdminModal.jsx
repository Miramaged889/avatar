"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { EditAdminForm } from "../../../forms/EditAdminForm";
import { useLocale } from "../../utils/useLocale";

export function EditAdminModal({
  open,
  onOpenChange,
  onSuccess,
  adminId = null,
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
          {t("modals.editAdmin") || "Edit Admin"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("modals.editAdminDescription") || "Update admin information"}
        </DialogDescription>
        {adminId && (
          <EditAdminForm
            adminId={adminId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

