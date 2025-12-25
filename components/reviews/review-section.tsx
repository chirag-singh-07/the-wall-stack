import { getReviews } from "@/actions/review-actions";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";

interface ReviewSectionProps {
  productId?: string;
  collectionId?: string;
  className?: string;
}

export async function ReviewSection({
  productId,
  collectionId,
  className,
}: ReviewSectionProps) {
  const targetId = productId || collectionId;
  if (!targetId) return null;

  const type = productId ? "product" : "collection";
  const result = await getReviews(targetId, type);
  const reviews = result.success && result.data ? result.data : [];

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5 lg:col-span-4">
          <ReviewForm productId={productId} collectionId={collectionId} />
        </div>
        <div className="md:col-span-7 lg:col-span-8">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
