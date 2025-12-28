import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomPosterCreator } from "@/components/custom-poster-creator";

export default function CustomPosterPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 rounded-full border border-black/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">
                Design Studio
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Craft Your <br />
              <span className="text-black/10 italic">Personal</span> Legacy
            </h1>
            <p className="text-black/40 max-w-xl text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-12">
              Transform your private memories into high-fidelity wall art. Our
              studio provides the tools, the paper, and the precision—you
              provide the vision.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://wa.me/917863834670?text=I'm%20interested%20in%20a%20custom%20or%20bulk%20poster%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-zinc-900 text-white px-8 py-4 rounded-full hover:bg-black transition-all duration-500 shadow-2xl shadow-black/20"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.247.447-.37.148-.124.198-.212.297-.353.099-.142.05-.266-.025-.415-.075-.149-.67-1.611-.918-2.21-.242-.588-.487-.508-.67-.518-.173-.01-.37-.012-.568-.012-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Custom Inquiries
                  </p>
                  <p className="text-sm font-black uppercase tracking-tighter">
                    Bulk Orders via WhatsApp
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
        <CustomPosterCreator />
      </section>

      <Footer />
    </main>
  );
}
