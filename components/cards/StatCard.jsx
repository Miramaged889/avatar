"use client";

import { Card, CardContent } from "../shadcn/CardWrapper";
import { useLocale } from "../utils/useLocale";
import { cn } from "../utils/cn";
import { MoreVertical } from "lucide-react";

export function StatCard({ title, value, newCount, gradient, icon: Icon }) {
  const { t, formatNumber, isRTL } = useLocale();

  return (
    <Card
      className={cn("overflow-hidden border-0 text-white relative", gradient)}
    >
      <CardContent className="p-6">
        {/* Top section with icon and menu */}
        <div
          className={cn(
            "flex items-start justify-between mb-6",
            isRTL && "flex-row-reverse"
          )}
        >
          {/* Icon in white rounded square */}
          {Icon && (
            <div className="bg-white rounded-lg p-2.5">
              <Icon className="h-6 w-6 text-primary-dark" />
            </div>
          )}
          {/* Three dots menu */}
          <button className="text-white opacity-80 hover:opacity-100 transition-opacity">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Main content - Number, Label, Mini graph and new count in same level */}
        <div
          className={cn(
            "flex items-end justify-between gap-4",
            isRTL && "flex-row-reverse"
          )}
        >
          {/* Left side: Number and Label */}
          <div className={cn("flex-1", isRTL && "text-right")}>
            <p className="text-3xl font-bold mb-2">{formatNumber(value)}</p>
            <p className="text-sm font-medium opacity-90">
              {typeof title === "string" && title.startsWith("stats.")
                ? t(title)
                : title}
            </p>
          </div>

          {/* Right side: Mini graph and new count */}
          <div
            className={cn("flex flex-col items-end", isRTL && "items-start")}
          >
            {/* Mini graph */}
            <div className="h-10 w-24 mb-1" role="img" aria-label="Mini chart">
              <svg
                className="h-full w-full"
                viewBox="0 0 200 50"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={`miniGradient-${value}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#FFC324" />
                    <stop offset="50%" stopColor="#FFC324" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>
                <polyline
                  points="0,45 15,42 30,38 45,35 60,32 75,28 90,25 105,22 120,20 135,18 150,16 165,15 180,14 195,13 200,12"
                  fill="none"
                  stroke={`url(#miniGradient-${value})`}
                  strokeWidth="2.5"
                />
              </svg>
            </div>
            {/* New count */}
            <span className="text-sm opacity-90">
              +{formatNumber(newCount)} New
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
