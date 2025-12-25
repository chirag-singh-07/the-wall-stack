import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { MarqueeBanner } from "@/components/marquee-banner";
import { PressMentions } from "@/components/press-mentions";
import { FeaturesSection } from "@/components/features-section";
import { TrendingSection } from "@/components/trending-section";
import { NewArrivals } from "@/components/new-arrivals";
import { RotatingShowcase } from "@/components/rotating-showcase";
import { BestSellers } from "@/components/best-sellers";
import { ComboSection } from "@/components/combo-section";
import { LimitedEdition } from "@/components/limited-edition";
import { CustomPosterCreator } from "@/components/custom-poster-creator";
import { RoomVisualizer } from "@/components/room-visualizer";
import { ComparisonSlider } from "@/components/comparison-slider";
import { ProcessSection } from "@/components/process-section";
import { FeaturedProducts } from "@/components/featured-products";
import { ParallaxBanner } from "@/components/parallax-banner";
import { CollectionShowcase } from "@/components/collection-showcase";
import { CollectionsSection } from "@/components/collections-section";
import { ArtistSpotlight } from "@/components/artist-spotlight";
import { SizeGuide } from "@/components/size-guide";
import { GiftCards } from "@/components/gift-cards";
import { CustomerGallery } from "@/components/customer-gallery";
import { StatsCounter } from "@/components/stats-counter";
import { Testimonials } from "@/components/testimonials";
import { InstagramGallery } from "@/components/instagram-gallery";
import { BrandStory } from "@/components/brand-story";
import { FAQSection } from "@/components/faq-section";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";
import { FloatingAction } from "@/components/floating-action";

import { getAllSections } from "@/actions/user/cms-actions";

export default async function HomePage() {
  const sectionsRes = await getAllSections();
  const sections = sectionsRes.success ? sectionsRes.data : [];

  const heroContent = sections?.find((s: any) => s.key === "hero")?.content;
  const marqueeContent = sections?.find(
    (s: any) => s.key === "marquee"
  )?.content;

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection content={heroContent} />
      <MarqueeBanner content={marqueeContent} />
      <PressMentions />
      <FeaturesSection />
      <TrendingSection />
      <NewArrivals />
      <RotatingShowcase />
      <BestSellers />
      <LimitedEdition />
      <ComboSection />
      <CustomPosterCreator />
      <RoomVisualizer />
      <ComparisonSlider />
      <ProcessSection />
      <FeaturedProducts />
      <ParallaxBanner />
      <CollectionShowcase />
      <CollectionsSection />
      <ArtistSpotlight />
      {/* <SizeGuide />
      <GiftCards /> */}
      <CustomerGallery />
      <StatsCounter />
      <Testimonials />
      <InstagramGallery />
      <BrandStory />
      <FAQSection />
      <Newsletter />
      <Footer />
      <FloatingAction />
    </main>
  );
}
