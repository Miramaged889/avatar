"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLocale } from "../../../../components/utils/useLocale";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../../../components/shadcn/ButtonWrapper";
import { Badge } from "../../../../components/shadcn/BadgeWrapper";
import { X, Plus, Edit, Trash2, AlertCircle, CheckCircle2, Image, ArrowLeft } from "lucide-react";
import { getAllClients } from "../../../../lib/api/clientApi";
import { getAllAdmins } from "../../../../lib/api/adminApi";
import { getAllPayments } from "../../../../lib/api/paymentApi";
import {
  getAllAvatars,
  getBusinessAvatarConfig,
  createBusinessAvatarConfig,
} from "../../../../lib/api/avatarApi";
import { removeClient } from "../../../../lib/store/slices/clientSlice";
import { AddClientForm } from "../../../../forms/AddClientForm";
import { removeAdmin } from "../../../../lib/store/slices/adminSlice";
import { AddAdminForm } from "../../../../forms/AddAdminForm";
import { EditAdminForm } from "../../../../forms/EditAdminForm";
import { AddPaymentForm } from "../../../../forms/AddPaymentForm";
import { EditPaymentForm } from "../../../../forms/EditPaymentForm";
import { removePayment } from "../../../../lib/store/slices/paymentSlice";
import { fetchBusinessDetails } from "../../../../lib/store/slices/businessSlice";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../../components/shadcn/DialogWrapper";
import { cn } from "../../../../components/utils/cn";

export default function ViewBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params?.id;
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
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempSelectedAvatarId, setTempSelectedAvatarId] = useState(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  // Fetch business details when businessId changes
  useEffect(() => {
    if (businessId) {
      dispatch(fetchBusinessDetails(businessId));
    }
  }, [businessId, dispatch]);

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

  // Function to fetch avatar config
  const fetchAvatarConfig = () => {
    if (!businessId) return;

    setLoadingAvatar(true);
    getBusinessAvatarConfig(businessId)
      .then((result) => {
        if (result.success) {
          const config = result.data?.config || result.data;
          const avatarId =
            config?.avatar_id ||
            config?.avatar_uuid ||
            config?.avatar?.id ||
            config?.avatar?.uuid_heygen ||
            null;
          if (avatarId) {
            // Fetch all avatars to find the matching one
            getAllAvatars().then((avatarsResult) => {
              if (avatarsResult.success) {
                const avatarsList = Array.isArray(avatarsResult.data)
                  ? avatarsResult.data
                  : avatarsResult.data?.results || [];
                const matchedAvatar = avatarsList.find(
                  (avatar) =>
                    String(avatar.id) === String(avatarId) ||
                    String(avatar.uuid_heygen) === String(avatarId)
                );
                setSelectedAvatar(matchedAvatar || null);
              }
            });
          } else {
            setSelectedAvatar(null);
          }
        } else {
          setSelectedAvatar(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching avatar config:", error);
        setSelectedAvatar(null);
      })
      .finally(() => {
        setLoadingAvatar(false);
      });
  };

  // Function to fetch all avatars for selection
  const fetchAvatars = () => {
    getAllAvatars()
      .then((result) => {
        if (result.success) {
          const avatarsList = Array.isArray(result.data)
            ? result.data
            : result.data?.results || [];
          setAvatars(avatarsList);
        }
      })
      .catch((error) => {
        console.error("Error fetching avatars:", error);
      });
  };

  // Fetch clients, admins, payments, and avatar when businessId changes
  useEffect(() => {
    if (businessId) {
      fetchClients();
      fetchAdmins();
      fetchPayments();
      fetchAvatarConfig();
      fetchAvatars();
    }
  }, [businessId]);

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

  // Handle open avatar selection modal
  const handleOpenAvatarModal = () => {
    setTempSelectedAvatarId(selectedAvatar?.id || null);
    setIsAvatarModalOpen(true);
  };

  // Handle close avatar selection modal
  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setTempSelectedAvatarId(null);
  };

  // Handle save avatar selection
  const handleSaveAvatar = async () => {
    if (!tempSelectedAvatarId || !businessId) {
      alert(t("messages.selectAvatar") || "Please select an avatar");
      return;
    }

    setIsSavingAvatar(true);
    try {
      const result = await createBusinessAvatarConfig({
        businessId: businessId,
        avatarId: tempSelectedAvatarId,
      });

      if (result.success) {
        alert(
          t("messages.avatarConfigSaved") ||
            "Avatar configuration saved successfully"
        );
        fetchAvatarConfig(); // Refresh avatar display
        handleCloseAvatarModal();
      } else {
        throw new Error(result.error || "Failed to save avatar config");
      }
    } catch (error) {
      console.error("Error saving avatar:", error);
      alert(
        t("messages.avatarConfigFailed") ||
          "Failed to save business avatar configuration"
      );
    } finally {
      setIsSavingAvatar(false);
    }
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
    <>
      <div key="header" className="space-y-6">
      {/* Header with Back Button */}
      <div
        className={cn(
          "flex items-center justify-between",
          isRTL && "flex-row-reverse"
        )}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/business")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("buttons.back") || "Back"}
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("modals.viewBusiness") || "View Business Details"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {t("modals.viewBusinessDescription") ||
                "View detailed information about this business"}
            </p>
          </div>
        </div>
      </div>
      </div>

      {loading && (
        <div key="loading" className="text-center py-8 text-gray-500">
          {t("messages.loading") || "Loading..."}
        </div>
      )}

      {!loading && currentBusiness && (
        <div key="content" className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-4 border-b pb-4">
            <div
              className={cn(
                "flex items-center justify-between",
                isRTL && "flex-row"
              )}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {t("business.avatar") || "Business Avatar"}
              </h3>
              {!selectedAvatar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenAvatarModal}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("buttons.chooseAvatar") || "Choose Avatar"}
                </Button>
              )}
            </div>

            {loadingAvatar ? (
              <div className="text-center py-8 text-gray-500">
                {t("messages.loading") || "Loading..."}
              </div>
            ) : selectedAvatar ? (
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary-dark shadow-md">
                    {selectedAvatar.preview_url ? (
                      <img
                        src={selectedAvatar.preview_url}
                        alt={selectedAvatar.name || "Avatar"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-lg font-semibold text-gray-600">
                        {(selectedAvatar.name || "A").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 bg-primary-dark text-white rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">
                    {selectedAvatar.name || "-"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("business.avatarSelected") || "Avatar selected"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenAvatarModal}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {t("buttons.changeAvatar") || "Change Avatar"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">
                  {t("messages.noAvatarSelected") ||
                    "No avatar selected for this business"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenAvatarModal}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  {t("buttons.chooseAvatar") || "Choose Avatar"}
                </Button>
              </div>
            )}
          </div>

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
        </div>
      )}

      {!loading && !currentBusiness && (
        <div key="not-found" className="text-center py-8 text-gray-500">
          {t("messages.businessNotFound") || "Business not found"}
        </div>
      )}

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

      {/* Avatar Selection Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={handleCloseAvatarModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle>
              {t("business.chooseAvatar") || "Choose Business Avatar"}
            </DialogTitle>
            <button
              type="button"
              className="ml-4 text-gray-400 hover:text-gray-600 transition"
              onClick={handleCloseAvatarModal}
              aria-label={t("buttons.close") || "Close"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            {t("business.avatarSelectionDescription") ||
              "Select an avatar for this business"}
          </DialogDescription>

          {avatars.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {avatars.map((avatar) => {
                  const isSelected =
                    String(tempSelectedAvatarId) === String(avatar.id);
                  return (
                    <button
                      type="button"
                      key={avatar.id}
                      onClick={() => setTempSelectedAvatarId(avatar.id)}
                      className={cn(
                        "group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                        isSelected
                          ? "border-primary-dark bg-primary-dark/5 shadow-md scale-105"
                          : "border-gray-200 hover:border-primary-dark/50 hover:bg-gray-50"
                      )}
                      aria-pressed={isSelected}
                      aria-label={avatar.name || "Avatar"}
                    >
                      <div
                        className={cn(
                          "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                          isSelected
                            ? "border-primary-dark shadow-lg"
                            : "border-gray-300 group-hover:border-primary-dark/50"
                        )}
                      >
                        {avatar.preview_url ? (
                          <img
                            src={avatar.preview_url}
                            alt={avatar.name || "Avatar"}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-sm font-semibold text-gray-600">
                            {(avatar.name || "A")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium text-center line-clamp-2 transition-colors duration-200",
                          isSelected
                            ? "text-primary-dark"
                            : "text-gray-700 group-hover:text-primary-dark"
                        )}
                      >
                        {avatar.name || "-"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="py-3 px-4"
                    onClick={handleCloseAvatarModal}
                    disabled={isSavingAvatar}
                  >
                    {t("buttons.cancel") || "Cancel"}
                  </Button>
                  <Button
                    variant="dark"
                    className="py-3 px-4"
                    onClick={handleSaveAvatar}
                    disabled={isSavingAvatar || !tempSelectedAvatarId}
                  >
                    {isSavingAvatar ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("buttons.saving") || "Saving..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {t("buttons.saveAvatar") || "Save Avatar"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {t("messages.noAvatars") || "No avatars available"}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
