"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface ProfileHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function ProfileHeader({ title, subtitle, breadcrumbs }: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/profile" className="hover:text-foreground transition-colors">
          Account
        </Link>
        {breadcrumbs?.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Title */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>

        {/* Decorative element */}
        <div className="hidden md:flex items-center gap-1">
          <div className="w-8 h-[2px] bg-foreground" />
          <div className="w-2 h-2 bg-foreground" />
        </div>
      </div>
    </div>
  )
}
