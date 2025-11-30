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
import { Edit, Trash2 } from "lucide-react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";
import { useDispatch } from "react-redux";
import { removeAdmin } from "../../lib/store/slices/adminSlice";

export function AdminsTable({ admins = [], onEdit, loading = false }) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = (adminId) => {
    if (
      confirm(
        t("messages.confirmDeleteAdmin") ||
          "Are you sure you want to delete this admin?"
      )
    ) {
      dispatch(removeAdmin(adminId));
    }
  };

  if (loading && admins.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.loading") || "Loading..."}
      </div>
    );
  }

  if (!loading && admins.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.noAdmins") || "No admins found"}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">
                {t("table.fullName") || "Full Name"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.email") || "Email"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.business") || "Business"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.status") || "Status"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.createdAt") || "Created At"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.actions") || "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  {admin.full_name || "-"}
                </TableCell>
                <TableCell>{admin.email || "-"}</TableCell>
                <TableCell>{admin.business_name || "-"}</TableCell>
                <TableCell>
                  <Badge variant={admin.is_active ? "default" : "secondary"}>
                    {admin.is_active
                      ? t("labels.active") || "Active"
                      : t("labels.inactive") || "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(admin.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit && onEdit(admin.id)}
                      className="p-2 text-gray-600 hover:text-primary-DEFAULT hover:bg-gray-100 rounded transition-colors"
                      aria-label={t("aria.editAdmin") || "Edit admin"}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label={t("aria.deleteAdmin") || "Delete admin"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

