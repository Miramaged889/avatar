"use client";

import { useState, useEffect } from "react";
import { PaymentsTable } from "../../../components/tables/PaymentsTable";
import { EditPaymentModal } from "../../../components/modals/payments/EditPaymentModal";
import { AddPaymentModal } from "../../../components/modals/payments/AddPaymentModal";
import { SelectInput } from "../../../forms/form-controls/SelectInput";
import { Button } from "../../../components/shadcn/ButtonWrapper";
import { Plus } from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPayments } from "../../../lib/store/slices/paymentSlice";
import { fetchAllBusinesses } from "../../../lib/store/slices/businessSlice";

export default function PaymentsPage() {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payment);
  const { businesses } = useSelector((state) => state.business);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");

  // Fetch businesses and payments on mount
  useEffect(() => {
    if (businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
    dispatch(fetchAllPayments());
  }, [dispatch]);

  // Refetch payments when business filter changes
  useEffect(() => {
    const params = {};
    if (selectedBusinessId) {
      params.business_id = selectedBusinessId;
    }
    dispatch(fetchAllPayments(params));
  }, [selectedBusinessId, dispatch]);

  const handleEdit = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedPaymentId(null);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveSuccess = () => {
    // Refresh payments list
    const params = {};
    if (selectedBusinessId) {
      params.business_id = selectedBusinessId;
    }
    dispatch(fetchAllPayments(params));
  };

  const businessOptions = [
    { value: "", label: t("payment.allBusinesses") || "All Businesses" },
    ...businesses.map((business) => ({
      value: String(business.id),
      label:
        locale === "ar" && business.name_ar
          ? business.name_ar
          : business.name_en || `Business #${business.id}`,
    })),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          isRTL && "sm:flex-row"
        )}
      >
        <div className={cn(isRTL && "text-left")}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("payment.pageTitle") || "Business Payments"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t("payment.description") || "View and manage business payments"}
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm sm:text-base h-10 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          {t("buttons.addPayment") || "Add Payment"}
        </Button>
      </div>

      {/* Filters */}
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg",
          isRTL && "sm:flex-row-reverse"
        )}
      >
        <SelectInput
          label={t("labels.business") || "Business"}
          name="business_filter"
          placeholder={t("placeholders.chooseBusiness") || "Choose business"}
          options={businessOptions}
          value={selectedBusinessId}
          onChange={setSelectedBusinessId}
          className="flex-1"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {typeof error === "string"
            ? error
            : error?.detail || "An error occurred"}
        </div>
      )}

      {/* Payments Table */}
      <PaymentsTable
        payments={payments}
        onEdit={handleEdit}
        loading={loading}
      />

      {/* Add Payment Modal */}
      <AddPaymentModal
        open={isAddModalOpen}
        onOpenChange={handleAddModalClose}
        onSuccess={handleSaveSuccess}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        onSuccess={handleSaveSuccess}
        paymentId={selectedPaymentId}
      />
    </div>
  );
}
