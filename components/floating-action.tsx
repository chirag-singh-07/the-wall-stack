"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ShoppingBag, ArrowUp, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingAction() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [cartCount] = useState(3)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0 pointer-events-auto",
      )}
    >
      {/* Expanded menu */}
      <div
        className={cn(
          "flex flex-col gap-2 transition-all duration-300",
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full bg-background border-foreground/20 hover:bg-foreground hover:text-background shadow-lg"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full bg-background border-foreground/20 hover:bg-foreground hover:text-background shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Main FAB */}
      <div className="flex items-center gap-3">
        {/* Cart button */}
        <Button
          className={cn(
            "h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-xl transition-all duration-300 px-5 gap-2",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
          )}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="font-medium">Cart</span>
          {cartCount > 0 && (
            <span className="w-6 h-6 rounded-full bg-background text-foreground text-sm font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>

        {/* Toggle button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="icon"
          className={cn(
            "w-14 h-14 rounded-full shadow-xl transition-all duration-300",
            isExpanded
              ? "bg-background text-foreground hover:bg-muted rotate-0"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          <div className={cn("transition-transform duration-300", isExpanded && "rotate-45")}>
            {isExpanded ? <X className="h-6 w-6" /> : <ArrowUp className="h-6 w-6" />}
          </div>
        </Button>
      </div>
    </div>
  )
}
