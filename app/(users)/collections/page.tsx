import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CollectionsGrid } from "@/components/collections/collections-grid";
import { CollectionsSearch } from "@/components/collections/collections-search";

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Our Collections
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collections of premium posters, each carefully
              designed to transform your space
            </p>
          </div>

          {/* Search and Filter */}
          <CollectionsSearch />

          {/* Collections Grid */}
          <CollectionsGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
