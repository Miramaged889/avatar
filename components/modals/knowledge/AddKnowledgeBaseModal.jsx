"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { KnowledgeBaseForm } from "../../../forms/KnowledgeBaseForm";
import { useLocale } from "../../utils/useLocale";

export function AddKnowledgeBaseModal({
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">
          {t("modals.addKnowledgeBase") || "Add Knowledge Base"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("modals.addKnowledgeBaseDescription") ||
            "Answer questions and upload files for your business"}
        </DialogDescription>
        <KnowledgeBaseForm
          businessId={businessId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

