"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "@/actions/review-actions";
import { ReviewsTable } from "@/components/admin/reviews-table";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await getAllReviews();
    if (res.success && res.data) {
      setReviews(res.data);
    } else {
      toast.error("Failed to fetch reviews");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    toast.promise(updateReviewStatus(id, status), {
      loading: "Updating status...",
      success: () => {
        fetchReviews();
        return "Review status updated";
      },
      error: "Failed to update status",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      toast.promise(deleteReview(id), {
        loading: "Deleting review...",
        success: () => {
          fetchReviews();
          return "Review deleted";
        },
        error: "Failed to delete review",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="Reviews" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Reviews</h1>
          <Button variant="outline" size="sm" onClick={fetchReviews}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ReviewsTable
            reviews={reviews}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
