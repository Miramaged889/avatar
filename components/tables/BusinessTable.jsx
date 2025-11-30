"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/TableWrapper";
import { Badge } from "../shadcn/BadgeWrapper";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";
import { useDispatch } from "react-redux";
import {
  removeBusiness,
  fetchBusinessDetails,
} from "../../lib/store/slices/businessSlice";

export function BusinessTable({
  businesses = [],
  onEdit,
  onView,
  loading = false,
}) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();

  const handleAction = (action, business) => {
    if (action === "view") {
      if (onView) {
        onView(business.id);
      } else {
        dispatch(fetchBusinessDetails(business.id));
      }
    } else if (action === "edit") {
      if (onEdit) {
        onEdit(business.id);
      }
    } else if (action === "delete") {
      if (
        confirm(
          t("messages.confirmDelete") ||
            "Are you sure you want to delete this business?"
        )
      ) {
        dispatch(removeBusiness(business.id));
      }
    }
  };

  const getCategoryLabel = (category) => {
    return t(`business.categories.${category}`) || category || "-";
  };

  const getBusinessName = (business) => {
    return locale === "ar" && business.name_ar
      ? business.name_ar
      : business.name_en || "-";
  };

  if (loading && businesses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.loading") || "Loading..."}
      </div>
    );
  }

  if (!loading && businesses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.noBusinesses") || "No businesses found"}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.businessName") || "Business Name"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.category") || "Category"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.country") || "Country"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.city") || "City"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("labels.domainUrl") || "Domain URL"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("labels.maxAdmins") || "Max Admins"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.actions") || "Actions"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow key={business.id}>
              <TableCell className={cn("font-medium", isRTL && "text-left")}>
                {getBusinessName(business)}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                <Badge variant="default">
                  {getCategoryLabel(business.category)}
                </Badge>
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {business.country || "-"}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {business.city || "-"}
              </TableCell>
                <TableCell className={cn(isRTL && "text-left")}>
                {business.domain_url ? (
                  <a
                    href={business.domain_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {business.domain_url}
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {business.max_admins || "-"}
              </TableCell>
              <TableCell>
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isRTL && "flex-row"
                  )}
                >
                  <button
                    onClick={() => handleAction("view", business)}
                    className="rounded p-1 text-primary-dark hover:bg-gray-100"
                    aria-label={t("aria.viewBusiness") || "View business"}
                  >
                    <Eye className="h-4 w-4 text-primary-dark" />
                  </button>
                  <button
                    onClick={() => handleAction("edit", business)}
                    className="rounded p-1 text-primary-dark hover:bg-gray-100"
                    aria-label={t("aria.editBusiness") || "Edit business"}
                  >
                    <Edit className="h-4 w-4 text-primary-dark" />
                  </button>
                  <button
                    onClick={() => handleAction("delete", business)}
                    className="rounded p-1 text-primary-dark hover:bg-red-50"
                    aria-label={t("aria.deleteBusiness") || "Delete business"}
                  >
                    <Trash2 className="h-4 w-4 text-primary-dark" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
