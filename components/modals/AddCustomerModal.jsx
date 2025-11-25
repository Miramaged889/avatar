"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../shadcn/DialogWrapper";
import { AddCustomerForm } from "../../forms/AddCustomerForm";

export function AddCustomerModal({ open, onOpenChange, onSuccess }) {
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
        <DialogTitle className="sr-only">Add New Customer</DialogTitle>
        <DialogDescription className="sr-only">
          Fill the information below to add a new customer.
        </DialogDescription>
        <AddCustomerForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
