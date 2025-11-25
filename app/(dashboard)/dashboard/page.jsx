"use client";

import { StatCard } from "../../../components/cards/StatCard";
import { Card, CardContent } from "../../../components/shadcn/CardWrapper";
import { Button } from "../../../components/shadcn/ButtonWrapper";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/shadcn/AvatarWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/shadcn/SelectWrapper";
import {
  Users,
  MessageSquare,
  UserCheck,
  Eye,
  Trash2,
  Pencil,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import { useLocale } from "../../../components/utils/useLocale";
import { cn } from "../../../components/utils/cn";

const sampleCustomers = [
  {
    id: 1,
    name: "Chris Friedly",
    company: "Supermarket Villanova",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    highlighted: false,
  },
  {
    id: 2,
    name: "Maggie Johnson",
    company: "Oasis Organic Inc.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maggie",
    highlighted: true,
  },
  {
    id: 3,
    name: "Gael Harry",
    company: "New York Forest Fruits",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gael",
    highlighted: false,
  },
  {
    id: 4,
    name: "Jenna Sullivan",
    company: "Walmart",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jenna",
    highlighted: false,
  },
];

export default function DashboardPage() {
  const { t, formatNumber, isRTL } = useLocale();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greetings.goodMorning");
    if (hour < 18) return t("greetings.goodAfternoon");
    return t("greetings.goodEvening");
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="stats.totalCustomers"
          value={2817}
          newCount={32}
          gradient="bg-gradient-stat-1"
          icon={Users}
        />
        <StatCard
          title="stats.interactions"
          value={181}
          newCount={32}
          gradient="bg-gradient-stat-2"
          icon={MessageSquare}
        />
        <StatCard
          title="stats.activeCustomers"
          value={1217}
          newCount={32}
          gradient="bg-gradient-stat-3"
          icon={UserCheck}
        />
      </div>

      {/* Customers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div
              className={cn(
                "flex items-center justify-between mb-6",
                isRTL && "flex-row-reverse"
              )}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {t("dashboard.customers")}
              </h2>
              <div
                className={cn(
                  "flex items-center gap-4",
                  isRTL && "flex-row-reverse"
                )}
              >
                <Select defaultValue="newest">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t("dashboard.sortBy.newest")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {t("dashboard.sortBy.newest")}
                    </SelectItem>
                    <SelectItem value="oldest">
                      {t("dashboard.sortBy.oldest")}
                    </SelectItem>
                    <SelectItem value="name">
                      {t("dashboard.sortBy.name")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              {sampleCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-colors",
                    customer.highlighted
                      ? "bg-primary-dark text-white"
                      : "hover:bg-gray-50",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <Avatar>
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback
                      className={
                        customer.highlighted ? "bg-gray-600 text-white" : ""
                      }
                    >
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("flex-1", isRTL && "text-right")}>
                    <p
                      className={cn(
                        "font-medium",
                        customer.highlighted ? "text-white" : "text-gray-900"
                      )}
                    >
                      {customer.name}
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        customer.highlighted ? "text-gray-300" : "text-gray-500"
                      )}
                    >
                      {customer.company}
                    </p>
                  </div>
                  {customer.highlighted && (
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <button className="p-1 hover:bg-primary-light rounded">
                        <Eye className="h-4 w-4 text-accent-yellow" />
                      </button>
                      <button className="p-1 hover:bg-primary-light rounded">
                        <Trash2 className="h-4 w-4 text-accent-yellow" />
                      </button>
                      <button className="p-1 hover:bg-primary-light rounded">
                        <Pencil className="h-4 w-4 text-accent-yellow" />
                      </button>
                      <button className="p-1 hover:bg-primary-light rounded">
                        <MoreVertical className="h-4 w-4 text-accent-yellow" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                {t("buttons.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Growth Chart */}
        <Card>
          <CardContent className="p-6">
            <div
              className={cn(
                "flex items-center justify-between mb-4",
                isRTL && "flex-row-reverse"
              )}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {t("dashboard.customersGrowth")}
              </h3>
              <Select defaultValue="yearly">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t("dashboard.period.yearly")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">
                    {t("dashboard.period.yearly")}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {t("dashboard.period.monthly")}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {t("dashboard.period.weekly")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className="h-64 w-full relative"
              role="img"
              aria-label="Customers growth chart"
            >
              <svg
                className="h-full w-full"
                viewBox="0 0 800 250"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFC324" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#EBC359" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0464ED" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {/* Y-axis labels */}
                <text
                  x="30"
                  y="15"
                  className="text-xs fill-gray-500 font-medium"
                >
                  100k
                </text>
                <text
                  x="30"
                  y="60"
                  className="text-xs fill-gray-500 font-medium"
                >
                  50k
                </text>
                <text
                  x="30"
                  y="130"
                  className="text-xs fill-gray-500 font-medium"
                >
                  20k
                </text>
                <text
                  x="30"
                  y="200"
                  className="text-xs fill-gray-500 font-medium"
                >
                  10k
                </text>
                <text
                  x="30"
                  y="248"
                  className="text-xs fill-gray-500 font-medium"
                >
                  0
                </text>

                {/* Grid lines */}
                <line
                  x1="60"
                  y1="20"
                  x2="60"
                  y2="240"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <line
                  x1="60"
                  y1="240"
                  x2="750"
                  y2="240"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />

                {/* Area chart path - starting from 2016 */}
                <path
                  d="M 60 220 L 140 200 L 220 180 L 300 160 L 380 140 L 460 120 L 540 100 L 620 90 L 700 80 L 700 240 L 60 240 Z"
                  fill="url(#areaGradient)"
                />
                <polyline
                  points="60,220 140,200 220,180 300,160 380,140 460,120 540,100 620,90 700,80"
                  fill="none"
                  stroke="#0464ED"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />

                {/* X-axis labels */}
                <text
                  x="100"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2016
                </text>
                <text
                  x="180"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2017
                </text>
                <text
                  x="260"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2018
                </text>
                <text
                  x="340"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2019
                </text>
                <text
                  x="420"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2020
                </text>
                <text
                  x="500"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2021
                </text>
                <text
                  x="580"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2022
                </text>
                <text
                  x="660"
                  y="248"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  2023
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p
              className={cn(
                "text-sm text-gray-500 mb-2",
                isRTL && "text-right"
              )}
            >
              {t("dashboard.topMonth")}
            </p>
            <p
              className={cn("text-2xl font-bold", isRTL && "text-right")}
              style={{ color: "#112CA3" }}
            >
              {t("dashboard.november")}
            </p>
            <p
              className={cn(
                "text-sm text-gray-500 mt-1",
                isRTL && "text-right"
              )}
            >
              {t("dashboard.year2019")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p
              className={cn(
                "text-sm text-gray-500 mb-2",
                isRTL && "text-right"
              )}
            >
              {t("dashboard.topYear")}
            </p>
            <p
              className={cn("text-2xl font-bold", isRTL && "text-right")}
              style={{ color: "#112CA3" }}
            >
              2023
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p
              className={cn(
                "text-sm text-gray-500 mb-2",
                isRTL && "text-right"
              )}
            >
              {t("dashboard.topCustomer")}
            </p>
            <div
              className={cn(
                "flex items-center gap-3 mt-2",
                isRTL && "flex-row-reverse"
              )}
            >
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maggie"
                  alt="Maggie Johnson"
                />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div className={cn("flex-1", isRTL && "text-right")}>
                <p className="text-lg font-bold text-gray-900">
                  Maggie Johnson
                </p>
                <p className="text-sm text-gray-500">Oasis Organic Inc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
