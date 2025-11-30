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
import { removePayment } from "../../lib/store/slices/paymentSlice";

export function PaymentsTable({ payments = [], onEdit, loading = false }) {
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

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPaymentMethodLabel = (method) => {
    return t(`payment.methods.${method}`) || method || "-";
  };

  const handleDelete = (paymentId) => {
    if (
      confirm(
        t("messages.confirmDeletePayment") ||
          "Are you sure you want to delete this payment?"
      )
    ) {
      dispatch(removePayment(paymentId));
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.loading") || "Loading..."}
      </div>
    );
  }

  if (!loading && payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        {t("messages.noPayments") || "No payments found"}
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
                {t("table.amountPaid") || "Amount Paid"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.paymentMethod") || "Payment Method"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.paymentDate") || "Payment Date"}
              </TableHead>
              <TableHead className="text-left">
                {t("table.note") || "Note"}
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
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {formatCurrency(payment.amount_paid)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getPaymentMethodLabel(payment.payment_method)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(payment.payment_date)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {payment.note || "-"}
                </TableCell>
                <TableCell>{formatDate(payment.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit && onEdit(payment.id)}
                      className="p-2 text-gray-600 hover:text-primary-DEFAULT hover:bg-gray-100 rounded transition-colors"
                      aria-label={t("aria.editPayment") || "Edit payment"}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label={t("aria.deletePayment") || "Delete payment"}
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
