"use client"

import { cn } from "@/lib/utils"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
  const isPositive = change && change > 0

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg",
        className,
      )}
    >
      {/* Decorative corner */}
      <div className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 bg-foreground/5 rounded-full transition-transform group-hover:scale-150" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={cn("text-sm font-medium", isPositive ? "text-green-600" : "text-red-600")}>
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-foreground p-3 text-background">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
