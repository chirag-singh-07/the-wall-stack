import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomerGallery } from "@/components/customer-gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Gallery | THE WALL STACK",
  description:
    "Explore how our community styles their spaces with our premium posters.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-24">
        <CustomerGallery />
      </div>
      <Footer />
    </main>
  );
}
