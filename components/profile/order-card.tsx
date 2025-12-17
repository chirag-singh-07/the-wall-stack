"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Truck, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Order } from "@/lib/user-store"

const statusConfig = {
  processing: {
    icon: Package,
    label: "Processing",
    color: "text-amber-600 bg-amber-50",
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    color: "text-blue-600 bg-blue-50",
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    color: "text-green-600 bg-green-50",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    color: "text-red-600 bg-red-50",
  },
}

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <div className="border border-border hover:border-foreground/30 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-border bg-muted/30">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Order</span>
            <p className="font-semibold">{order.id}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Date</span>
            <p className="font-medium">
              {new Date(order.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
            <p className="font-semibold">${order.total.toFixed(2)}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium", status.color)}>
          <StatusIcon className="w-4 h-4" />
          {status.label}
        </div>
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="flex flex-wrap gap-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative w-16 h-20 bg-muted">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.size} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
        </p>
        <Link href={`/profile/orders/${order.id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            View Details
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
