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

// Sample customers data - names and packages will be translated
const sampleCustomers = [
  {
    id: 1,
    nameKey: "janeCooper",
    phone: "(225) 555-0118",
    package: "premium",
    startDate: "2024-01-10",
    endDate: "2024-01-10",
    status: "active",
  },
  {
    id: 2,
    nameKey: "floydMiles",
    phone: "(205) 555-0100",
    package: "basic",
    startDate: "2024-01-10",
    endDate: "2024-01-10",
    status: "inactive",
  },
  {
    id: 3,
    nameKey: "ronaldRichards",
    phone: "(302) 555-0107",
    package: "premium",
    startDate: "2024-03-15",
    endDate: "2024-03-15",
    status: "inactive",
  },
  {
    id: 4,
    nameKey: "marvinMcKinney",
    phone: "(252) 555-0126",
    package: "gold",
    startDate: "2024-02-01",
    endDate: "2024-02-01",
    status: "active",
  },
  {
    id: 5,
    nameKey: "jeromeBell",
    phone: "(629) 555-0129",
    package: "basic",
    startDate: "2024-01-10",
    endDate: "2024-01-10",
    status: "active",
  },
  {
    id: 6,
    nameKey: "kathrynMurphy",
    phone: "(406) 555-0120",
    package: "gold",
    startDate: "2024-02-01",
    endDate: "2024-02-01",
    status: "active",
  },
  {
    id: 7,
    nameKey: "jacobJones",
    phone: "(208) 555-0112",
    package: "basic",
    startDate: "2024-03-15",
    endDate: "2024-03-15",
    status: "active",
  },
  {
    id: 8,
    nameKey: "kristinWatson",
    phone: "(704) 555-0127",
    package: "basic",
    startDate: "2024-02-01",
    endDate: "2024-02-01",
    status: "inactive",
  },
];

export function CustomersTable({ customers = sampleCustomers }) {
  const { t, formatDate, isRTL } = useLocale();

  const handleAction = (action, customer) => {
    console.log(action, customer);
    // Implement action handlers
  };

  const getPackageLabel = (packageValue) => {
    return t(`customers.packages.${packageValue}`) || packageValue;
  };

  const getCustomerName = (nameKey) => {
    return t(`customers.customerNames.${nameKey}`) || nameKey;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.customerName")}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.phoneNumber")}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.packagePlan")}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.startDate")}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.endDate")}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.status")}
            </TableHead>
            <TableHead className={cn(isRTL && "text-left")}>
              {t("table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className={cn("font-medium", isRTL && "text-left")}>
                {getCustomerName(customer.nameKey)}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {customer.phone}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {getPackageLabel(customer.package)}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {customer.startDate}
              </TableCell>
              <TableCell className={cn(isRTL && "text-left")}>
                {customer.endDate}
              </TableCell>
              <TableCell>
                <Badge
                  variant={customer.status === "active" ? "success" : "danger"}
                >
                  {t(`status.${customer.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <div
                  className={cn("flex items-center gap-2", isRTL && "flex-row")}
                >
                  <button
                    onClick={() => handleAction("view", customer)}
                    className="rounded p-1 text-primary-dark hover:bg-gray-100"
                    aria-label="View customer"
                  >
                    <Eye className="h-4 w-4 text-primary-dark" />
                  </button>
                  <button
                    onClick={() => handleAction("edit", customer)}
                    className="rounded p-1 text-primary-dark hover:bg-gray-100"
                    aria-label="Edit customer"
                  >
                    <Edit className="h-4 w-4 text-primary-dark" />
                  </button>
                  <button
                    onClick={() => handleAction("delete", customer)}
                    className="rounded p-1 text-primary-dark hover:bg-red-50"
                    aria-label="Delete customer"
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
