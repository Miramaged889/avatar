"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { useLocale } from "../../utils/useLocale";
import { useSelector } from "react-redux";
import { Button } from "../../shadcn/ButtonWrapper";

export function ViewClientModal({ open, onOpenChange, clientId }) {
  const { t, locale } = useLocale();
  const { currentClient, loading } = useSelector((state) => state.client);
  const { businesses } = useSelector((state) => state.business);

  const getBusinessName = (businessId) => {
    if (!businessId || !businesses.length) return "-";
    const business = businesses.find((b) => b.id === businessId);
    if (!business) return "-";
    return locale === "ar" && business.name_ar
      ? business.name_ar
      : business.name_en || `Business #${businessId}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>
          {t("modals.viewClient") || "View Client Details"}
        </DialogTitle>
        <DialogDescription>
          {t("modals.viewClientDescription") ||
            "View detailed information about this client"}
        </DialogDescription>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            {t("messages.loading") || "Loading..."}
          </div>
        )}

        {!loading && currentClient && (
          <div className="space-y-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {t("table.clientName") || "Client Name"}
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {currentClient.name || "-"}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {t("table.email") || "Email"}
              </label>
              <p className="text-base text-gray-900">
                {currentClient.email || "-"}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {t("table.phone") || "Phone"}
              </label>
              <p className="text-base text-gray-900">
                {currentClient.phone || "-"}
              </p>
            </div>

            {/* Business */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {t("table.business") || "Business"}
              </label>
              <p className="text-base text-gray-900">
                {getBusinessName(
                  currentClient.business || currentClient.business_id
                )}
              </p>
            </div>

            {/* Created At */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {t("table.createdAt") || "Created At"}
              </label>
              <p className="text-base text-gray-900">
                {formatDate(currentClient.created_at)}
              </p>
            </div>

            {/* Updated At */}
            {currentClient.updated_at && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  {t("table.updatedAt") || "Updated At"}
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(currentClient.updated_at)}
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="font-medium py-2"
              >
                {t("buttons.close") || "Close"}
              </Button>
            </div>
          </div>
        )}

        {!loading && !currentClient && (
          <div className="text-center py-8 text-gray-500">
            {t("messages.clientNotFound") || "Client not found"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

