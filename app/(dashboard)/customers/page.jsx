"use client";

import { useState } from "react";
import { CustomersTable } from "../../../components/tables/CustomersTable";
import { AddCustomerModal } from "../../../components/modals/AddCustomerModal";
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

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, formatNumber, isRTL } = useLocale();

  const handleAddSuccess = (data) => {
    console.log("Customer added:", data);
    // Refresh table or update state
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
            {t("customers.pageTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t("customers.activeMembers")}
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
              <SelectValue placeholder={t("customers.sortBy.newest")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                {t("customers.sortBy.newest")}
              </SelectItem>
              <SelectItem value="oldest">
                {t("customers.sortBy.oldest")}
              </SelectItem>
              <SelectItem value="name">
                {t("customers.sortBy.name")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="dark"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 rounded-md py-2 text-sm sm:text-base h-10 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            {t("buttons.addCustomer")}
          </Button>
        </div>
      </div>

      {/* Table - Scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[600px] sm:min-w-full">
          <CustomersTable />
        </div>
      </div>

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
          {t("customers.pagination.showing")} 1 {t("customers.pagination.to")}{" "}
          8 {t("customers.pagination.of")} 256K{" "}
          {t("customers.pagination.entries")}
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

      {/* Add Customer Modal */}
      <AddCustomerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
