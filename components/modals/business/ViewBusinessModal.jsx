"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { useLocale } from "../../utils/useLocale";
import { useSelector } from "react-redux";
import { Button } from "../../shadcn/ButtonWrapper";
import { Badge } from "../../shadcn/BadgeWrapper";
import { X } from "lucide-react";

export function ViewBusinessModal({ open, onOpenChange, businessId }) {
  const { t, locale } = useLocale();
  const { currentBusiness, loading } = useSelector((state) => state.business);

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

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryLabel = (category) => {
    return t(`business.categories.${category}`) || category || "-";
  };

  const getPaymentMethodLabel = (method) => {
    return t(`payment.methods.${method}`) || method || "-";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* X Button to close modal */}
        <div className="flex items-center justify-between">
          <DialogTitle>
            {t("modals.viewBusiness") || "View Business Details"}
          </DialogTitle>
          <button
            type="button"
            className="ml-4 text-gray-400 hover:text-gray-600 transition"
            onClick={() => onOpenChange(false)}
            aria-label={t("buttons.close") || "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <DialogDescription>
          {t("modals.viewBusinessDescription") ||
            "View detailed information about this business"}
        </DialogDescription>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            {t("messages.loading") || "Loading..."}
          </div>
        )}

        {!loading && currentBusiness && (
          <div className="space-y-6">
            {/* Business Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                {t("business.basicInfo") || "Basic Information"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name (English) */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.nameEn") || "Name (English)"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.name_en || "-"}
                  </p>
                </div>

                {/* Name (Arabic) */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.nameAr") || "Name (Arabic)"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.name_ar || "-"}
                  </p>
                </div>

                {/* Legal Name (English) */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.legalNameEn") || "Legal Name (English)"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.legal_name_en || "-"}
                  </p>
                </div>

                {/* Legal Name (Arabic) */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.legalNameAr") || "Legal Name (Arabic)"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.legal_name_ar || "-"}
                  </p>
                </div>

                {/* Tax Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.taxNumber") || "Tax Number"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.tax_number || "-"}
                  </p>
                </div>

                {/* Commercial Register Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.commercialRegisterNumber") ||
                      "Commercial Register Number"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.commercial_register_number || "-"}
                  </p>
                </div>

                {/* Domain URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.domainUrl") || "Domain URL"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.domain_url ? (
                      <a
                        href={currentBusiness.domain_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {currentBusiness.domain_url}
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("table.category") || "Category"}
                  </label>
                  <Badge variant="default">
                    {getCategoryLabel(currentBusiness.category)}
                  </Badge>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("table.country") || "Country"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.country || "-"}
                  </p>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("table.city") || "City"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.city || "-"}
                  </p>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.address") || "Address"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.address || "-"}
                  </p>
                </div>

                {/* Max Admins */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("labels.maxAdmins") || "Max Admins"}
                  </label>
                  <p className="text-base text-gray-900">
                    {currentBusiness.max_admins || "-"}
                  </p>
                </div>

                {/* Created At */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    {t("table.createdAt") || "Created At"}
                  </label>
                  <p className="text-base text-gray-900">
                    {formatDate(currentBusiness.created_at)}
                  </p>
                </div>

                {/* Updated At */}
                {currentBusiness.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t("table.updatedAt") || "Updated At"}
                    </label>
                    <p className="text-base text-gray-900">
                      {formatDate(currentBusiness.updated_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payments Section */}
            {Array.isArray(currentBusiness.payments) &&
              currentBusiness.payments.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("business.payments") || "Payments"} (
                    {currentBusiness.payments.length})
                  </h3>
                  <div className="space-y-3">
                    {currentBusiness.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {t("payment.amountPaid") || "Amount Paid"}
                            </label>
                            <p className="text-base font-semibold text-gray-900">
                              {formatCurrency(payment.amount_paid)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {t("payment.method") || "Payment Method"}
                            </label>
                            <p className="text-base text-gray-900">
                              {getPaymentMethodLabel(payment.payment_method)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {t("payment.date") || "Payment Date"}
                            </label>
                            <p className="text-base text-gray-900">
                              {formatDate(payment.payment_date)}
                            </p>
                          </div>
                          {payment.note && (
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {t("payment.note") || "Note"}
                              </label>
                              <p className="text-base text-gray-900">
                                {payment.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Clients Section */}
            {Array.isArray(currentBusiness.clients) &&
              currentBusiness.clients.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("business.clients") || "Clients"} (
                    {currentBusiness.clients.length})
                  </h3>
                  <div className="space-y-3">
                    {currentBusiness.clients.map((client) => (
                      <div
                        key={client.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {t("table.clientName") || "Client Name"}
                            </label>
                            <p className="text-base font-semibold text-gray-900">
                              {client.name || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {t("table.email") || "Email"}
                            </label>
                            <p className="text-base text-gray-900">
                              {client.email || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {t("table.phone") || "Phone"}
                            </label>
                            <p className="text-base text-gray-900">
                              {client.phone || "-"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {t("table.createdAt") || "Created At"}
                            </label>
                            <p className="text-base text-gray-900">
                              {formatDate(client.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="font-medium py-3 px-4 text-lg"
                onClick={() => onOpenChange(false)}
                style={{ minWidth: "140px" }}
              >
                {t("buttons.close") || "Close"}
              </Button>
            </div>
          </div>
        )}

        {!loading && !currentBusiness && (
          <div className="text-center py-8 text-gray-500">
            {t("messages.businessNotFound") || "Business not found"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
