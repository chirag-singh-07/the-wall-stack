import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomPosterMaker } from "@/components/custom-poster/custom-poster-maker";

export default function CustomPosterPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-24 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Create Your Custom Poster
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Design your perfect poster with our easy-to-use customization tool
            </p>
          </div>

          <CustomPosterMaker />
        </div>
      </section>

      <Footer />
    </main>
  );
}
