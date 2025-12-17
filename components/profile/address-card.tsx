"use client"

import { MapPin, Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Address } from "@/lib/user-store"

interface AddressCardProps {
  address: Address
  onEdit?: () => void
  onDelete?: () => void
  onSetDefault?: () => void
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div
      className={cn(
        "border p-5 transition-all",
        address.isDefault ? "border-foreground bg-muted/30" : "border-border hover:border-foreground/30",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              address.isDefault ? "bg-foreground text-background" : "bg-muted",
            )}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold">{address.label}</h3>
            {address.isDefault && <span className="text-xs text-muted-foreground">Default Address</span>}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!address.isDefault && onSetDefault && (
            <Button variant="ghost" size="icon" onClick={onSetDefault} title="Set as default">
              <Star className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-sm">
        <p className="font-medium">
          {address.firstName} {address.lastName}
        </p>
        <p className="text-muted-foreground">{address.street}</p>
        <p className="text-muted-foreground">
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="text-muted-foreground">{address.country}</p>
        <p className="text-muted-foreground pt-2">{address.phone}</p>
      </div>
    </div>
  )
}
