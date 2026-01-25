"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusinessTable } from "../../../components/tables/BusinessTable";
import { AddBusinessModal } from "../../../components/modals/business/AddBusinessModal";
import { Button } from "../../../components/shadcn/ButtonWrapper";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBusinesses,
} from "../../../lib/store/slices/businessSlice";

const ITEMS_PER_PAGE = 8;

export default function BusinessPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { t, formatNumber, isRTL } = useLocale();
  const dispatch = useDispatch();
  const { businesses, loading, error } = useSelector((state) => state.business);

  // Fetch businesses on component mount
  useEffect(() => {
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  // Paginate businesses
  const paginatedBusinesses = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return businesses.slice(startIndex, endIndex);
  };

  const paginatedBusinessesList = paginatedBusinesses();
  const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, businesses.length);

  const handleAddSuccess = (data) => {
    dispatch(fetchAllBusinesses());
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page numbers at once

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      if (currentPage <= 3) {
        // Show first pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last pages
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleEdit = (businessId) => {
    setSelectedBusinessId(businessId);
    setIsModalOpen(true);
  };

  const handleView = (businessId) => {
    router.push(`/business/${businessId}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBusinessId(null);
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
              businesses={paginatedBusinessesList}
              onEdit={handleEdit}
              onView={handleView}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && businesses.length > 0 && (
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
            {t("business.pagination.showing") || "Showing"} {startIndex}{" "}
            {t("business.pagination.to") || "to"} {endIndex}{" "}
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
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={cn(
                "px-2 sm:px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed",
                isRTL && "rotate-180"
              )}
              aria-label={t("aria.previousPage") || "Previous page"}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="hidden md:inline-block px-2 text-gray-500 text-sm shrink-0"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "px-2 sm:px-3 py-1 rounded border border-gray-300 text-xs sm:text-sm shrink-0 transition-colors",
                    currentPage === page
                      ? "bg-accent-yellow text-gray-900 hover:bg-accent-yellow/90 font-medium"
                      : "hover:bg-gray-50",
                    index === 0 || index === getPageNumbers().length - 1
                      ? "inline-block"
                      : "hidden sm:inline-block"
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={cn(
                "px-2 sm:px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed",
                isRTL && "rotate-180"
              )}
              aria-label={t("aria.nextPage") || "Next page"}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Business Modal */}
      <AddBusinessModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={handleAddSuccess}
        businessId={selectedBusinessId}
      />
    </div>
  );
}
