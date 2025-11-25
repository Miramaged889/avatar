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
    <div className="space-y-6">
      {/* Header + Actions Bar in same line */}
      <div
        className={cn(
          "flex items-center justify-between gap-4",
          isRTL && "flex-row"
        )}
      >
        <div className={cn(isRTL && "text-left")}>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("customers.pageTitle")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("customers.activeMembers")}
          </p>
        </div>
        <div className={cn("flex items-center gap-4", isRTL && "flex-row")}>
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
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
            className="flex items-center gap-2 px-3 rounded-md py-2 text-base h-10"
          >
            <Plus className="h-5 w-5" />
            {t("buttons.addCustomer")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <CustomersTable />

      {/* Pagination */}
      <div
        className={cn(
          "flex items-center justify-between",
          isRTL && "flex-row-reverse"
        )}
      >
        <p className={cn("text-sm text-gray-500", isRTL && "text-right")}>
          {t("customers.pagination.showing")} 1 {t("customers.pagination.to")} 8 {t("customers.pagination.of")} 256K {t("customers.pagination.entries")}
        </p>
        <div
          className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
        >
          <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm">
            ←
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-accent-yellow text-gray-900 hover:bg-accent-yellow/90 text-sm font-medium">
            1
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm">
            2
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm">
            3
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm">
            4
          </button>
          <span className="px-2 text-gray-500">...</span>
          <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm">
            40
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm">
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
