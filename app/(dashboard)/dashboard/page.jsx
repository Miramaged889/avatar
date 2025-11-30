"use client";

import { useEffect } from "react";
import { StatCard } from "../../../components/cards/StatCard";
import { Card, CardContent } from "../../../components/shadcn/CardWrapper";
import {
  Users,
  UserCheck,
  Building2,
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchRecentActivities,
} from "../../../lib/store/slices/dashboardSlice";

export default function DashboardPage() {
  const { t, isRTL, locale } = useLocale();
  const dispatch = useDispatch();
  const { stats, recentActivities, loading, error } = useSelector(
    (state) => state.dashboard  
  );

  // Fetch dashboard data on mount
  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivities());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greetings.goodMorning");
    if (hour < 18) return t("greetings.goodAfternoon");
    return t("greetings.goodEvening");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "$0";
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}</h1>
        <p className="text-sm text-gray-500 mt-2">
          {t("dashboard.greetingDescription")}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {typeof error === "string"
            ? error
            : error?.detail || "An error occurred while loading dashboard data"}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="stats.totalBusinesses"
          value={stats.totalBusinesses || 0}
          newCount={stats.newBusinesses || 0}
          gradient="bg-gradient-stat-1"
          icon={Building2}
        />
        <StatCard
          title="stats.totalClients"
          value={stats.totalClients || 0}
          newCount={stats.newClients || 0}
          gradient="bg-gradient-stat-2"
          icon={Users}
        />
        <StatCard
          title="stats.totalPayments"
          value={stats.totalPayments || 0}
          newCount={stats.newPayments || 0}
          gradient="bg-gradient-stat-1"
          icon={CreditCard}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {t("stats.totalRevenue") || "Total Revenue"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalPaymentsAmount || 0)}
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {t("stats.activeBusinesses") || "Active Businesses"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeBusinesses || 0}
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {t("stats.activeClients") || "Active Clients"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeClients || 0}
                </p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardContent className="p-6">
            <div
              className={cn(
                "flex items-center justify-between mb-6",
                isRTL && "flex-row"
              )}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {t("dashboard.recentActivities") || "Recent Activities"}
              </h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                {t("messages.loading") || "Loading..."}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t("dashboard.noActivities") || "No recent activities"}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors",
                      isRTL && "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2",
                        activity.type === "payment"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      )}
                    >
                      {activity.type === "payment" ? (
                        <CreditCard className="h-4 w-4 text-green-600" />
                      ) : (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className={cn("flex-1", isRTL && "text-left")}>
                      <p className="font-medium text-gray-900">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className={cn("text-left", isRTL && "text-left")}>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(activity.amount)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("dashboard.systemOverview") || "System Overview"}
            </h2>

            <div className="space-y-4">
              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg bg-gray-50",
                  isRTL && "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRTL && "flex-row"
                  )}
                >
                  <Building2 className="h-5 w-5 text-primary-DEFAULT" />
                  <span className="text-gray-700">
                    {t("navigation.business") || "Business"}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.totalBusinesses || 0}
                </span>
              </div>

              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg bg-gray-50",
                  isRTL && "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRTL && "flex-row"
                  )}
                >
                  <Users className="h-5 w-5 text-primary-DEFAULT" />
                  <span className="text-gray-700">
                    {t("navigation.clients") || "Clients"}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.totalClients || 0}
                </span>
              </div>


              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg bg-gray-50",
                  isRTL && "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                      isRTL && "flex-row"
                  )}
                >
                  <CreditCard className="h-5 w-5 text-primary-DEFAULT" />
                  <span className="text-gray-700">
                    {t("navigation.payments") || "Payments"}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.totalPayments || 0}
                </span>
              </div>

              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg bg-gray-50",
                  isRTL && "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRTL && "flex-row"
                  )}
                >
                  <DollarSign className="h-5 w-5 text-primary-DEFAULT" />
                  <span className="text-gray-700">
                    {t("stats.totalRevenue") || "Total Revenue"}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(stats.totalPaymentsAmount || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
