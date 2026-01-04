import { AdminHeader } from "@/components/admin/admin-header";
import { Timer, Construction, Sparkles } from "lucide-react";

const LandingPhotoPage = () => {
  return (
    <div className="min-h-screen pb-20">
      <AdminHeader title="Landing Photos Management" />

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-primary/20 bg-card/50 backdrop-blur-sm">
          <div className="relative mb-8">
            <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl animate-pulse" />
            <div className="relative h-20 w-20 rounded-full bg-background flex items-center justify-center border border-primary/20">
              <Construction className="h-10 w-10 text-primary animate-bounce" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-pulse" />
          </div>

          <h2 className="text-3xl font-black italic tracking-tighter mb-4 text-primary uppercase">
            Coming Soon
          </h2>

          <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">
            We're building a powerful landing photo manager where you can
            upload, edit, and organize all your marketing assets in one place.
          </p>

          <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-full border border-primary/10">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Development in Progress
            </span>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl w-full px-6">
            <div className="p-4 rounded-xl border border-muted/50 bg-background/50">
              <h3 className="font-bold text-sm mb-2 uppercase">Hero Banners</h3>
              <p className="text-xs text-muted-foreground italic">
                Customizable full-width banners with overlay controls.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-muted/50 bg-background/50">
              <h3 className="font-bold text-sm mb-2 uppercase">Promo Grids</h3>
              <p className="text-xs text-muted-foreground italic">
                Drag-and-drop landing grids for featured collections.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-muted/50 bg-background/50">
              <h3 className="font-bold text-sm mb-2 uppercase">
                Asset Library
              </h3>
              <p className="text-xs text-muted-foreground italic">
                A centralized library for all your high-res photography.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPhotoPage;
