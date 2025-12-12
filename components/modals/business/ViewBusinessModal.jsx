"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../shadcn/DialogWrapper";
import { useLocale } from "../../utils/useLocale";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../shadcn/ButtonWrapper";
import { Badge } from "../../shadcn/BadgeWrapper";
import { X, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { getAllClients } from "../../../lib/api/clientApi";
import { getAllAdmins } from "../../../lib/api/adminApi";
import { getAllPayments } from "../../../lib/api/paymentApi";
import { removeClient } from "../../../lib/store/slices/clientSlice";
import { AddClientForm } from "../../../forms/AddClientForm";
import { removeAdmin } from "../../../lib/store/slices/adminSlice";
import { AddAdminForm } from "../../../forms/AddAdminForm";
import { EditAdminForm } from "../../../forms/EditAdminForm";
import { AddPaymentForm } from "../../../forms/AddPaymentForm";
import { EditPaymentForm } from "../../../forms/EditPaymentForm";
import { removePayment } from "../../../lib/store/slices/paymentSlice";
import { cn } from "../../utils/cn";

export function ViewBusinessModal({ open, onOpenChange, businessId }) {
  const { t, locale, isRTL } = useLocale();
  const dispatch = useDispatch();
  const { currentBusiness, loading } = useSelector((state) => state.business);
  const [clients, setClients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // Function to fetch clients
  const fetchClients = () => {
    if (!businessId) return;

    setLoadingClients(true);
    getAllClients()
      .then((result) => {
        if (result.success) {
          const allClients = Array.isArray(result.data)
            ? result.data
            : result.data?.results || [];
          // Filter clients by business
          const businessClients = allClients.filter(
            (client) => client.business === Number(businessId)
          );
          setClients(businessClients);
        }
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      })
      .finally(() => {
        setLoadingClients(false);
      });
  };

  // Function to fetch admins
  const fetchAdmins = () => {
    if (!businessId) return;

    setLoadingAdmins(true);
    getAllAdmins({ business: businessId })
      .then((result) => {
        if (result.success) {
          const allAdmins = Array.isArray(result.data)
            ? result.data
            : result.data?.results || [];
          setAdmins(allAdmins);
        }
      })
      .catch((error) => {
        console.error("Error fetching admins:", error);
      })
      .finally(() => {
        setLoadingAdmins(false);
      });
  };

  // Function to fetch payments
  const fetchPayments = () => {
    if (!businessId) return;

    setLoadingPayments(true);
    getAllPayments({ business: Number(businessId) })
      .then((result) => {
        if (result.success) {
          const allPayments = Array.isArray(result.data)
            ? result.data
            : result.data?.results || [];
          setPayments(allPayments);
        }
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
      })
      .finally(() => {
        setLoadingPayments(false);
      });
  };

  // Fetch clients, admins, and payments when businessId changes
  useEffect(() => {
    if (open && businessId) {
      fetchClients();
      fetchAdmins();
      fetchPayments();
    } else {
      // Reset when modal closes
      setClients([]);
      setAdmins([]);
      setPayments([]);
      setSelectedClientId(null);
      setSelectedAdminId(null);
      setSelectedPaymentId(null);
    }
  }, [open, businessId]);

  // Handle add client
  const handleAddClient = () => {
    setSelectedClientId(null);
    setIsClientModalOpen(true);
  };

  // Handle edit client
  const handleEditClient = (clientId) => {
    setSelectedClientId(clientId);
    setIsClientModalOpen(true);
  };

  // Handle delete client
  const handleDeleteClient = async (clientId) => {
    if (
      !confirm(
        t("messages.confirmDeleteClient") ||
          "Are you sure you want to delete this client?"
      )
    ) {
      return;
    }

    try {
      await dispatch(removeClient(clientId)).unwrap();
      // Refresh clients list
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      alert(
        error?.message ||
          t("messages.deleteFailed") ||
          "Failed to delete client"
      );
    }
  };

  // Handle client form success
  const handleClientSuccess = () => {
    fetchClients();
    setIsClientModalOpen(false);
    setSelectedClientId(null);
  };

  // Handle client modal close
  const handleClientModalClose = () => {
    setIsClientModalOpen(false);
    setSelectedClientId(null);
  };

  // Handle add admin
  const handleAddAdmin = () => {
    setSelectedAdminId(null);
    setIsAdminModalOpen(true);
  };

  // Handle edit admin
  const handleEditAdmin = (adminId) => {
    setSelectedAdminId(adminId);
    setIsAdminModalOpen(true);
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (
      !confirm(
        t("messages.confirmDeleteAdmin") ||
          "Are you sure you want to delete this admin?"
      )
    ) {
      return;
    }

    try {
      await dispatch(removeAdmin(adminId)).unwrap();
      // Refresh admins list
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert(
        error?.message || t("messages.deleteFailed") || "Failed to delete admin"
      );
    }
  };

  // Handle admin form success
  const handleAdminSuccess = () => {
    fetchAdmins();
    setIsAdminModalOpen(false);
    setSelectedAdminId(null);
  };

  // Handle admin modal close
  const handleAdminModalClose = () => {
    setIsAdminModalOpen(false);
    setSelectedAdminId(null);
  };

  // Handle add payment
  const handleAddPayment = () => {
    setSelectedPaymentId(null);
    setIsPaymentModalOpen(true);
  };

  // Handle edit payment
  const handleEditPayment = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setIsPaymentModalOpen(true);
  };

  // Handle delete payment
  const handleDeletePayment = async (paymentId) => {
    if (
      !confirm(
        t("messages.confirmDeletePayment") ||
          "Are you sure you want to delete this payment?"
      )
    ) {
      return;
    }

    try {
      await dispatch(removePayment(paymentId)).unwrap();
      // Refresh payments list
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert(
        error?.message ||
          t("messages.deleteFailed") ||
          "Failed to delete payment"
      );
    }
  };

  // Handle payment form success
  const handlePaymentSuccess = () => {
    fetchPayments();
    setIsPaymentModalOpen(false);
    setSelectedPaymentId(null);
  };

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedPaymentId(null);
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
            <div className="space-y-4 border-t pt-4">
              <div
                className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row"
                )}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("business.payments") || "Payments"} ({payments.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddPayment}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("buttons.addPayment") || "Add Payment"}
                </Button>
              </div>
              {loadingPayments ? (
                <div className="text-center py-4 text-gray-500">
                  {t("messages.loading") || "Loading payments..."}
                </div>
              ) : payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                    >
                      <div
                        className={`absolute top-2 ${
                          isRTL ? "left-2" : "right-2"
                        } flex gap-2`}
                      >
                        <button
                          onClick={() => handleEditPayment(payment.id)}
                          className="p-1 rounded text-primary-dark hover:bg-gray-200 transition-colors"
                          aria-label={
                            t("aria.editPaymentAria") ||
                            t("aria.editPayment") ||
                            "Edit payment"
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={
                            t("aria.deletePaymentAria") ||
                            t("aria.deletePayment") ||
                            "Delete payment"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div
                        className={cn(
                          "grid grid-cols-1 md:grid-cols-2 gap-4",
                          isRTL ? "pl-12" : "pr-12"
                        )}
                      >
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
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {t("messages.noPaymentsForBusiness") ||
                    t("messages.noPayments") ||
                    "No payments found for this business"}
                </div>
              )}
            </div>

            {/* Clients Section */}
            <div className="space-y-4 border-t pt-4">
              <div
                className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row"
                )}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("business.clients") || "Clients"} ({clients.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddClient}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("buttons.addClient") || "Add Client"}
                </Button>
              </div>
              {loadingClients ? (
                <div className="text-center py-4 text-gray-500">
                  {t("messages.loading") || "Loading clients..."}
                </div>
              ) : clients.length > 0 ? (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                    >
                      <div
                        className={`absolute top-2 ${
                          isRTL ? "left-2" : "right-2"
                        } flex gap-2`}
                      >
                        <button
                          onClick={() => handleEditClient(client.id)}
                          className="p-1 rounded text-primary-dark hover:bg-gray-200 transition-colors"
                          aria-label={t("aria.editClient") || "Edit client"}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={t("aria.deleteClient") || "Delete client"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div
                        className={cn(
                          "grid grid-cols-1 md:grid-cols-2 gap-4",
                          isRTL ? "pl-12" : "pr-12"
                        )}
                      >
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
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {t("messages.noClients") ||
                    "No clients found for this business"}
                </div>
              )}
            </div>

            {/* Admins Section */}
            <div className="space-y-4 border-t pt-4">
              <div
                className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row"
                )}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("business.admins") || "Admins"} ({admins.length}
                    {currentBusiness?.max_admins
                      ? `/${currentBusiness.max_admins}`
                      : ""}
                    )
                  </h3>
                  {currentBusiness?.max_admins && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span className="font-medium">
                          {t("labels.maxAdmins") || "Max:"}
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {currentBusiness.max_admins}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-gray-600">
                          {t("labels.remaining") || "Remaining:"}
                        </span>
                        <span
                          className={cn(
                            "font-semibold",
                            currentBusiness.max_admins - admins.length > 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {currentBusiness.max_admins - admins.length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddAdmin}
                    className="flex items-center gap-2"
                    disabled={
                      currentBusiness?.max_admins !== null &&
                      currentBusiness?.max_admins !== undefined &&
                      admins.length >= currentBusiness.max_admins
                    }
                    title={
                      currentBusiness?.max_admins !== null &&
                      currentBusiness?.max_admins !== undefined &&
                      admins.length >= currentBusiness.max_admins
                        ? t("messages.maxAdminsReached", {
                            max: currentBusiness.max_admins,
                          }) ||
                          `Maximum number of admins (${currentBusiness.max_admins}) has been reached for this business.`
                        : ""
                    }
                  >
                    <Plus className="h-4 w-4" />
                    {t("buttons.addAdmin") || "Add Admin"}
                  </Button>
                  {currentBusiness?.max_admins !== null &&
                    currentBusiness?.max_admins !== undefined &&
                    admins.length >= currentBusiness.max_admins && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>
                          {t("messages.maxReached") || "Limit reached"}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              {loadingAdmins ? (
                <div className="text-center py-4 text-gray-500">
                  {t("messages.loading") || "Loading admins..."}
                </div>
              ) : admins.length > 0 ? (
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                    >
                      <div
                        className={`absolute top-2 ${
                          isRTL ? "left-2" : "right-2"
                        } flex gap-2`}
                      >
                        <button
                          onClick={() => handleEditAdmin(admin.id)}
                          className="p-1 rounded text-primary-dark hover:bg-gray-200 transition-colors"
                          aria-label={t("aria.editAdmin") || "Edit admin"}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={t("aria.deleteAdmin") || "Delete admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div
                        className={cn(
                          "grid grid-cols-1 md:grid-cols-2 gap-4",
                          isRTL ? "pl-12" : "pr-12"
                        )}
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("table.fullName") || "Full Name"}
                          </label>
                          <p className="text-base font-semibold text-gray-900">
                            {admin.full_name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("table.email") || "Email"}
                          </label>
                          <p className="text-base text-gray-900">
                            {admin.email || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("table.isActive") || "Status"}
                          </label>
                          <Badge
                            variant={admin.is_active ? "default" : "secondary"}
                          >
                            {admin.is_active
                              ? t("labels.active") || "Active"
                              : t("labels.inactive") || "Inactive"}
                          </Badge>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {t("table.createdAt") || "Created At"}
                          </label>
                          <p className="text-base text-gray-900">
                            {formatDate(admin.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {t("messages.noAdmins") ||
                    "No admins found for this business"}
                </div>
              )}
            </div>

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

      {/* Client Form Modal */}
      <Dialog open={isClientModalOpen} onOpenChange={handleClientModalClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {selectedClientId
              ? t("modals.editClient") || "Edit Client"
              : t("modals.addClient") || "Add Client"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedClientId
              ? t("modals.editClientDescription") || "Update client information"
              : t("modals.addClientDescription") ||
                "Fill the information below to add a new client"}
          </DialogDescription>
          <AddClientForm
            clientId={selectedClientId}
            onSuccess={handleClientSuccess}
            onCancel={handleClientModalClose}
            businessId={businessId} // Pass businessId to pre-fill the form
          />
        </DialogContent>
      </Dialog>

      {/* Admin Form Modal */}
      <Dialog open={isAdminModalOpen} onOpenChange={handleAdminModalClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {selectedAdminId
              ? t("modals.editAdmin") || "Edit Admin"
              : t("modals.addAdmin") || "Add Admin"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedAdminId
              ? t("modals.editAdminDescription") || "Update admin information"
              : t("modals.addAdminDescription") ||
                "Fill the information below to add a new admin"}
          </DialogDescription>
          {selectedAdminId ? (
            <EditAdminForm
              adminId={selectedAdminId}
              onSuccess={handleAdminSuccess}
              onCancel={handleAdminModalClose}
            />
          ) : (
            <AddAdminForm
              onSuccess={handleAdminSuccess}
              onCancel={handleAdminModalClose}
              businessId={businessId} // Pass businessId to pre-fill the form
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Form Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={handlePaymentModalClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {selectedPaymentId
              ? t("modals.editPayment") || "Edit Payment"
              : t("modals.addPayment") || "Add Payment"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedPaymentId
              ? t("modals.editPaymentDescription") ||
                "Update payment information"
              : t("modals.addPaymentDescription") ||
                "Fill the information below to add a new payment"}
          </DialogDescription>
          {selectedPaymentId ? (
            <EditPaymentForm
              paymentId={selectedPaymentId}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentModalClose}
            />
          ) : (
            <AddPaymentForm
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentModalClose}
              businessId={businessId} // Pass businessId to pre-fill the form
            />
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
