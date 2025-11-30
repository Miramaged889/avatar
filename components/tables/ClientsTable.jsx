"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/TableWrapper";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";
import { useDispatch, useSelector } from "react-redux";
import { removeClient, fetchClientDetails } from "../../lib/store/slices/clientSlice";
import { fetchAllBusinesses } from "../../lib/store/slices/businessSlice";

export function ClientsTable({
  clients = [],
  onEdit,
  onView,
  loading = false,
}) {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { businesses } = useSelector((state) => state.business);

  // Fetch businesses if not loaded
  React.useEffect(() => {
    if (businesses.length === 0) {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch, businesses.length]);

  const handleAction = (action, client) => {
    if (action === "view") {
      if (onView) {
        onView(client.id);
      } else {
        dispatch(fetchClientDetails(client.id));
      }
    } else if (action === "edit") {
      if (onEdit) {
        onEdit(client.id);
      }
    } else if (action === "delete") {
      if (
        confirm(
          t("messages.confirmDeleteClient") ||
            "Are you sure you want to delete this client?"
        )
      ) {
        dispatch(removeClient(client.id));
      }
    }
  };

  const getBusinessName = (businessId) => {
    if (!businessId || !businesses.length) return "-";
    const business = businesses.find((b) => b.id === businessId);
    if (!business) return "-";
    return locale === "ar" && business.name_ar
      ? business.name_ar
      : business.name_en || `Business #${businessId}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.loading") || "Loading..."}
      </div>
    );
  }

  if (!loading && clients.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.noClients") || "No clients found"}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.clientName") || "Client Name"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.email") || "Email"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.phone") || "Phone"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.business") || "Business"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.createdAt") || "Created At"}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.actions") || "Actions"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className={cn("font-medium", isRTL && "text-left")}>
                {client.name || "-"}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {client.email || "-"}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {client.phone || "-"}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {getBusinessName(client.business || client.business_id)}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {formatDate(client.created_at)}
              </TableCell>
              <TableCell>
                <div
                  className={cn("flex items-center gap-2", isRTL && "flex-row")}
                >
                  <button
                    onClick={() => handleAction("view", client)}
                    className="rounded p-1 text-primary-dark hover:bg-gray-100"
                    aria-label={t("aria.viewClient") || "View client"}
                  >
                    <Eye className="h-4 w-4 text-primary-dark" />
                  </button>
                  <button
                    onClick={() => handleAction("edit", client)}
                    className="rounded p-1 text-primary-dark hover:bg-gray-100"
                    aria-label={t("aria.editClient") || "Edit client"}
                  >
                    <Edit className="h-4 w-4 text-primary-dark" />
                  </button>
                  <button
                    onClick={() => handleAction("delete", client)}
                    className="rounded p-1 text-primary-dark hover:bg-red-50"
                    aria-label={t("aria.deleteClient") || "Delete client"}
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

