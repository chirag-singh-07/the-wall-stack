"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewsTableProps {
  reviews: any[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export function ReviewsTable({
  reviews,
  onStatusChange,
  onDelete,
}: ReviewsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No reviews found
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="font-medium">
                    {review.user?.name || "Anonymous"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {review.user?.email}
                  </div>
                </TableCell>
                <TableCell>
                  {review.product ? (
                    <span className="text-sm font-medium">
                      Product: {review.product.title}
                    </span>
                  ) : review.collection ? (
                    <span className="text-sm font-medium">
                      Collection: {review.collection.title}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Unknown</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">{review.rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate text-sm" title={review.comment || ""}>
                    {review.comment || (
                      <span className="text-muted-foreground italic">
                        No comment
                      </span>
                    )}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      review.status === "approved"
                        ? "default"
                        : review.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {review.status !== "approved" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
                        onClick={() => onStatusChange(review.id, "approved")}
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {review.status !== "rejected" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                        onClick={() => onStatusChange(review.id, "rejected")}
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(review.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
