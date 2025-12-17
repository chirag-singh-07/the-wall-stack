"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Star, Quote } from "lucide-react"

const tabs = [
  { id: "description", label: "Description" },
  { id: "shipping", label: "Shipping & Returns" },
  { id: "reviews", label: "Reviews" },
]

const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely stunning piece! The print quality exceeded my expectations. It looks even better in person.",
    verified: true,
  },
  {
    id: 2,
    name: "James K.",
    rating: 5,
    date: "1 month ago",
    comment:
      "Perfect addition to my home office. The minimalist design brings such a sophisticated touch to the space.",
    verified: true,
  },
  {
    id: 3,
    name: "Emma L.",
    rating: 4,
    date: "1 month ago",
    comment: "Great quality and fast shipping. Would definitely recommend to anyone looking for modern wall art.",
    verified: true,
  },
]

interface ProductTabsProps {
  description: string
}

export function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <section className="py-16 border-t">
      <div className="container px-4 md:px-8 mx-auto">
        {/* Tab Headers */}
        <div className="flex gap-8 border-b mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 text-sm font-medium whitespace-nowrap transition-colors relative",
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl">
          {activeTab === "description" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <p className="text-muted-foreground leading-relaxed">{description}</p>
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Materials</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Premium 250gsm matte art paper</li>
                    <li>• Archival quality pigment inks</li>
                    <li>• Acid-free for longevity</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Care Instructions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Frame behind glass for protection</li>
                    <li>• Avoid direct sunlight exposure</li>
                    <li>• Handle with clean, dry hands</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h4 className="font-medium">Shipping Information</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    All posters are carefully rolled and shipped in sturdy cardboard tubes to ensure they arrive in
                    perfect condition.
                  </p>
                  <ul className="space-y-2">
                    <li>
                      • <strong className="text-foreground">Standard Shipping:</strong> 5-7 business days
                    </li>
                    <li>
                      • <strong className="text-foreground">Express Shipping:</strong> 2-3 business days
                    </li>
                    <li>
                      • <strong className="text-foreground">Free Shipping:</strong> On orders over $75
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Returns & Exchanges</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    We want you to be completely satisfied with your purchase. If you're not happy with your order, we
                    offer:
                  </p>
                  <ul className="space-y-2">
                    <li>• 30-day return policy for unused items</li>
                    <li>• Free returns on damaged or defective items</li>
                    <li>• Easy exchange process for different sizes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Rating Summary */}
              <div className="flex items-center gap-6 pb-6 border-b">
                <div className="text-center">
                  <div className="text-4xl font-bold">4.8</div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn("h-4 w-4", star <= 5 ? "fill-foreground text-foreground" : "text-muted")}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Based on 47 reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{rating}</span>
                      <Star className="h-3 w-3 fill-foreground text-foreground" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full"
                          style={{
                            width: rating === 5 ? "78%" : rating === 4 ? "15%" : rating === 3 ? "5%" : "2%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.name}</span>
                          {review.verified && (
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-3 w-3",
                                  star <= review.rating ? "fill-foreground text-foreground" : "text-muted",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <Quote className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
