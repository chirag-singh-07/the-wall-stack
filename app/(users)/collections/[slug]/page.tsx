import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CollectionDetail } from "@/components/collections/collection-detail";
import { getCollectionBySlug } from "@/actions/user/collection-actions";
import { notFound } from "next/navigation";
import { ReviewSection } from "@/components/reviews/review-section";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCollectionBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <CollectionDetail collection={result.data} />
      <div className="bg-muted/20">
        <ReviewSection
          collectionId={result.data.id}
          className="container mx-auto py-12 px-4"
        />
      </div>
      <Footer />
    </main>
  );
}
