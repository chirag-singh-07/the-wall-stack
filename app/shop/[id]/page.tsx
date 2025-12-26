import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductTabs } from "@/components/product/product-tabs";
import { RecommendedProducts } from "@/components/product/recommended-products";
import { getProductWithDetails, getRecommendedProducts } from "@/lib/products";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ReviewSection } from "@/components/reviews/review-section";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductWithDetails(id);

  if (!product) {
    notFound();
  }

  const recommendedProducts = await getRecommendedProducts(
    id,
    product.category,
    4
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b mt-20">
        <div className="container px-4 md:px-8 mx-auto py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/shop"
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[150px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8 md:py-16">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery image={product.image} title={product.title} />
            </div>

            {/* Info */}
            <ProductInfo
              productId={product.id}
              title={product.title}
              price={product.price}
              category={product.category}
              description={product.description}
              sizes={product.sizes}
              details={product.details}
            />
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <ProductTabs description={product.description} />

      {/* Review Section */}
      <section className="py-8 md:py-16 bg-muted/20">
        <div className="container px-4 md:px-8 mx-auto">
          <ReviewSection productId={product.id} />
        </div>
      </section>

      {/* Recommended Products */}
      <RecommendedProducts
        products={recommendedProducts}
        currentCategory={product.category}
      />

      <Footer />
    </main>
  );
}
