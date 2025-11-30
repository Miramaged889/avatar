"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { EditAnswerForm } from "../../../forms/EditAnswerForm";
import { useLocale } from "../../utils/useLocale";

export function EditAnswerModal({
  open,
  onOpenChange,
  onSuccess,
  answerId = null,
  question = null,
  answer = null,
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
          {t("modals.editAnswer") || "Edit Answer"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("modals.editAnswerDescription") || "Update answer information"}
        </DialogDescription>
        {answerId && question && answer && (
          <EditAnswerForm
            answerId={answerId}
            question={question}
            answer={answer}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

