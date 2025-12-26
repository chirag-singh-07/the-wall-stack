"use client";

import { useState } from "react";
import { useUserStore } from "@/lib/user-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { createReview } from "@/actions/review-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId?: string;
  collectionId?: string;
  onSuccess?: () => void;
}

export function ReviewForm({
  productId,
  collectionId,
  onSuccess,
}: ReviewFormProps) {
  const { user } = useUserStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="bg-muted/50 p-6 rounded-lg text-center">
        <p className="text-muted-foreground mb-4">
          Please log in to leave a review.
        </p>
        <Button variant="outline" asChild>
          <a href="/login">Log In</a>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    const result = await createReview({
      userId: user.id,
      rating,
      text: comment,
      productId,
      collectionId,
    });

    if (result.success) {
      toast.success("Review submitted for approval!");
      setRating(0);
      setComment("");
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.error || "Failed to submit review");
    }
    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card p-6 rounded-lg border"
    >
      <h3 className="text-lg font-semibold">Write a Review</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Comment (Optional)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="resize-none"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
