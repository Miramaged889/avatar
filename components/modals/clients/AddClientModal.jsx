"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { AddClientForm } from "../../../forms/AddClientForm";

export function AddClientModal({ open, onOpenChange, onSuccess, clientId = null }) {
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
          {clientId ? "Edit Client" : "Add New Client"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {clientId
            ? "Update client information"
            : "Fill the information below to add a new client"}
        </DialogDescription>
        <AddClientForm
          clientId={clientId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

