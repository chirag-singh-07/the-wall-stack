"use client"

import { useAdminStore } from "@/lib/admin-store"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function SalesChart() {
  const { salesData } = useAdminStore()

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground">Daily revenue for the last 14 days</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#171717" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#171717" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              tick={{ fontSize: 12 }}
              stroke="#a3a3a3"
            />
            <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} stroke="#a3a3a3" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                      <p className="text-sm font-medium">
                        {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-lg font-bold">${payload[0].value}</p>
                      <p className="text-xs text-muted-foreground">{payload[0].payload.orders} orders</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#171717" strokeWidth={2} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
