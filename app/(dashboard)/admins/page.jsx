"use client";

import { useState, useEffect } from "react";
import { AdminsTable } from "../../../components/tables/AdminsTable";
import { EditAdminModal } from "../../../components/modals/admins/EditAdminModal";
import { AddAdminModal } from "../../../components/modals/admins/AddAdminModal";
import { SelectInput } from "../../../forms/form-controls/SelectInput";
import { Button } from "../../../components/shadcn/ButtonWrapper";
import { Plus } from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAdmins } from "../../../lib/store/slices/adminSlice";
import { fetchAllBusinesses } from "../../../lib/store/slices/businessSlice";

export default function AdminsPage() {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { admins, loading, error } = useSelector((state) => state.admin);
  const { businesses } = useSelector((state) => state.business);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");

  // Fetch businesses on mount
  useEffect(() => {
    if (businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch, businesses.length]);

  // Fetch admins when business filter changes or on mount
  useEffect(() => {
    const params = {};
    if (selectedBusinessId) {
      params.business = selectedBusinessId;
      dispatch(fetchAllAdmins(params));
    }
    // Only fetch if a business is selected
    // If no business is selected, don't fetch (API requires business parameter)
  }, [selectedBusinessId, dispatch]);

  const handleEdit = (adminId) => {
    setSelectedAdminId(adminId);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAdminId(null);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveSuccess = () => {
    // Refresh admins list
    const params = {};
    if (selectedBusinessId) {
      params.business = selectedBusinessId;
    }
    dispatch(fetchAllAdmins(params));
  };

  const businessOptions = [
    { value: "", label: t("admin.allBusinesses") || "All Businesses" },
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
            {t("admin.pageTitle") || "Admins Management"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t("admin.description") || "View and manage admins"}
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm sm:text-base h-10 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          {t("buttons.addAdmin") || "Add Admin"}
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

      {/* Admins Table */}
      <AdminsTable
        admins={admins}
        onEdit={handleEdit}
        loading={loading}
      />

      {/* Add Admin Modal */}
      <AddAdminModal
        open={isAddModalOpen}
        onOpenChange={handleAddModalClose}
        onSuccess={handleSaveSuccess}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        onSuccess={handleSaveSuccess}
        adminId={selectedAdminId}
      />
    </div>
  );
}

