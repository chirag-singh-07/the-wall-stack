"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={review.user.image || undefined} />
              <AvatarFallback>
                {review.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  {review.user.name || "Anonymous"}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < review.rating
                        ? "fill-current"
                        : "text-muted-foreground fill-none"
                    )}
                  />
                ))}
              </div>
              {review.text && (
                <p className="text-sm text-muted-foreground mt-2">
                  {review.text}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
