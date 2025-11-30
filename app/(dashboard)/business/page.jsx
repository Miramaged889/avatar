"use client";

import { useState, useEffect } from "react";
import { BusinessTable } from "../../../components/tables/BusinessTable";
import { AddBusinessModal } from "../../../components/modals/business/AddBusinessModal";
import { ViewBusinessModal } from "../../../components/modals/business/ViewBusinessModal";
import { Button } from "../../../components/shadcn/ButtonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/shadcn/SelectWrapper";
import { Plus } from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBusinesses,
  fetchBusinessDetails,
} from "../../../lib/store/slices/businessSlice";

export default function BusinessPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [viewingBusinessId, setViewingBusinessId] = useState(null);
  const { t, formatNumber, isRTL } = useLocale();
  const dispatch = useDispatch();
  const { businesses, loading, error } = useSelector((state) => state.business);

  // Fetch businesses on component mount
  useEffect(() => {
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  const handleAddSuccess = (data) => {
    dispatch(fetchAllBusinesses());
  };

  const handleEdit = (businessId) => {
    setSelectedBusinessId(businessId);
    setIsModalOpen(true);
  };

  const handleView = (businessId) => {
    setViewingBusinessId(businessId);
    dispatch(fetchBusinessDetails(businessId));
    setIsViewModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBusinessId(null);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewingBusinessId(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header + Actions Bar */}
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          isRTL && "sm:flex-row"
        )}
      >
        <div className={cn(isRTL && "text-left")}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("business.pageTitle") || "Business"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t("business.activeMembers") || "Active businesses"}
          </p>
        </div>
        <div
          className={cn(
            "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4",
            isRTL && "sm:flex-row"
          )}
        >
          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue
                placeholder={t("business.sortBy.newest") || "Newest"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                {t("business.sortBy.newest") || "Newest"}
              </SelectItem>
              <SelectItem value="oldest">
                {t("business.sortBy.oldest") || "Oldest"}
              </SelectItem>
              <SelectItem value="name">
                {t("business.sortBy.name") || "Name"}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="dark"
            onClick={() => {
              setSelectedBusinessId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-3 rounded-md py-2 text-sm sm:text-base h-10 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            {t("buttons.addBusiness") || "Add Business"}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {typeof error === "string" ? error : "An error occurred"}
        </div>
      )}

      {/* Loading State */}
      {loading && !businesses.length && (
        <div className="text-center py-8 text-gray-500">
          {t("messages.loading") || "Loading..."}
        </div>
      )}

      {/* Table - Scrollable on mobile */}
      {!loading && (
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="min-w-[600px] sm:min-w-full">
            <BusinessTable
              businesses={businesses}
              onEdit={handleEdit}
              onView={handleView}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Pagination */}
      <div
        className={cn(
          "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4",
          isRTL && "sm:flex-row-reverse"
        )}
      >
        <p
          className={cn(
            "text-xs sm:text-sm text-gray-500 text-center sm:text-left",
            isRTL && "sm:text-right"
          )}
        >
          {t("business.pagination.showing") || "Showing"} 1{" "}
          {t("business.pagination.to") || "to"}{" "}
          {businesses.length > 8 ? 8 : businesses.length}{" "}
          {t("business.pagination.of") || "of"} {businesses.length}{" "}
          {t("business.pagination.entries") || "entries"}
        </p>
        <div
          className={cn(
            "flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto",
            isRTL && "sm:flex-row-reverse"
          )}
        >
          <button
            className={cn(
              "px-2 sm:px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm shrink-0",
              isRTL && "rotate-180"
            )}
            aria-label={t("aria.previousPage") || "Previous page"}
          >
            ←
          </button>
          <button className="px-2 sm:px-3 py-1 rounded border border-gray-300 bg-accent-yellow text-gray-900 hover:bg-accent-yellow/90 text-xs sm:text-sm font-medium shrink-0">
            1
          </button>
          <button className="hidden sm:inline-block px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm shrink-0">
            2
          </button>
          <button className="hidden sm:inline-block px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm shrink-0">
            3
          </button>
          <button className="hidden md:inline-block px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm shrink-0">
            4
          </button>
          <span className="hidden md:inline-block px-2 text-gray-500 text-sm shrink-0">
            ...
          </span>
          <button className="hidden md:inline-block px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm shrink-0">
            40
          </button>
          <button
            className={cn(
              "px-2 sm:px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm shrink-0",
              isRTL && "rotate-180"
            )}
            aria-label={t("aria.nextPage") || "Next page"}
          >
            →
          </button>
        </div>
      </div>

      {/* Add/Edit Business Modal */}
      <AddBusinessModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={handleAddSuccess}
        businessId={selectedBusinessId}
      />

      {/* View Business Modal */}
      <ViewBusinessModal
        open={isViewModalOpen}
        onOpenChange={handleViewModalClose}
        businessId={viewingBusinessId}
      />
    </div>
  );
}
