"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Camera,
  User,
  Loader2,
  Upload,
  X,
  ArrowRight,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getApprovedGalleryPosts,
  submitGalleryPost,
  likeGalleryPost,
  checkUserSubmissionStatus,
  addGalleryComment,
  getGalleryComments,
  deleteGalleryPost,
} from "@/actions/user/gallery-actions";
import { authClient } from "@/lib/auth-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";

export function CustomerGallery() {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  const [selectedPostDetails, setSelectedPostDetails] = useState<any | null>(
    null
  );
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    caption: "",
    posterName: "",
    location: "",
    instagramUrl: "",
  });

  const fetchPosts = async () => {
    const result = await getApprovedGalleryPosts();
    if (result.success && result.data) {
      setPosts(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (session?.user?.id) {
        const res = await checkUserSubmissionStatus(session.user.id);
        if (res.success) {
          setHasSubmitted(res.hasSubmitted || false);
        }
      }
    };

    fetchPosts();
    checkStatus();
  }, [session?.user?.id]);

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) return;

    setLikedPosts((prev) => new Set(prev).add(postId));
    setPosts((current) =>
      current.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    await likeGalleryPost(postId);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this gallery post?")) return;

    const res = await deleteGalleryPost(postId);
    if (res.success) {
      toast.success("Post deleted");
      setPosts(posts.filter((p) => p.id !== postId));
      if (activeIndex >= posts.length - 1)
        setActiveIndex(Math.max(0, posts.length - 2));
    } else {
      toast.error("Failed to delete post");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSubmitted) {
      toast.error("You can only upload one image to the gallery.");
      return;
    }
    if (!formData.image || !formData.caption) {
      toast.error("Image and caption are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitGalleryPost({
        userId: session?.user?.id,
        userName: session?.user?.name || "Guest User",
        userAvatar: session?.user?.image || "",
        userLocation: formData.location || "Unknown Location",
        image: formData.image,
        caption: formData.caption,
        posterName: formData.posterName,
        instagramUrl: formData.instagramUrl,
      });

      if (result.success) {
        toast.success("Photo submitted for approval!");
        setIsDialogOpen(false);
        setHasSubmitted(true);
        setFormData({
          image: "",
          caption: "",
          posterName: "",
          location: "",
          instagramUrl: "",
        });
      } else {
        toast.error(result.error || "Failed to submit photo");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetails = async (post: any) => {
    setSelectedPostDetails(post);
    setIsDetailsOpen(true);
    setLoadingComments(true);
    const res = await getGalleryComments(post.id);
    if (res.success && res.data) setComments(res.data);
    setLoadingComments(false);
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !session?.user?.id || !selectedPostDetails)
      return;

    const res = await addGalleryComment({
      postId: selectedPostDetails.id,
      userId: session.user.id,
      text: newComment,
    });

    if (res.success && res.data) {
      setComments([
        ...comments,
        {
          ...res.data,
          user: { name: session.user.name, image: session.user.image },
        },
      ]);
      setNewComment("");
      toast.success("Comment added");
    }
  };

  const navigate = (dir: number) => {
    setActiveIndex((prev) => (prev + dir + posts.length) % posts.length);
  };

  if (isLoading)
    return (
      <div className="h-[80vh] flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black/20" />
      </div>
    );

  const currentPost = posts[activeIndex];

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="py-24 md:py-40 bg-zinc-50 text-black overflow-hidden relative"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-black/5 to-transparent opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/5 text-black/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-black/10">
                <Sparkles className="w-3 h-3" />
                <span>#THEWALLSTACKCommunity</span>
              </div>
              <div className="h-px w-12 bg-black/10" />
            </div>
            <h2 className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
              Community <span className="text-black/10 italic">Gallery</span>
            </h2>
            <p className="text-black/40 max-w-sm text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Witness how our global community integrates THE WALL STACK
              masterpieces into their private sanctuaries.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-end gap-6"
          >
            {session ? (
              <Button
                size="lg"
                className="bg-black text-white hover:bg-black/90 rounded-full px-10 h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/10 group"
                disabled={hasSubmitted}
                onClick={() => setIsDialogOpen(true)}
              >
                {hasSubmitted ? "Already Shared" : "Share Your Setup"}
                <Camera className="ml-3 w-4 h-4 transition-transform group-hover:scale-110" />
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 rounded-full px-10 h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/10 group"
                >
                  Login to Share
                  <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all group"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Cinematic Presentation */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {currentPost ? (
              <motion.div
                key={currentPost.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                {/* Main Visual */}
                <div
                  className="lg:col-span-8 group relative aspect-square md:aspect-video rounded-4xl overflow-hidden border border-black/10 shadow-2xl cursor-zoom-in"
                  onClick={() => openDetails(currentPost)}
                >
                  <Image
                    src={currentPost.image}
                    alt={currentPost.caption}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />

                  {/* Floating Action Badge */}
                  <div className="absolute bottom-8 right-8 flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="rounded-full bg-white/5 backdrop-blur-xl border-white/10 text-black hover:bg-black hover:text-white transition-all h-12 px-6 font-black uppercase tracking-widest text-[9px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(currentPost.id);
                      }}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 mr-2",
                          likedPosts.has(currentPost.id) &&
                            "fill-red-500 text-red-500 border-none"
                        )}
                      />
                      {currentPost.likes} Appreciation
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full w-12 h-12 shadow-2xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(currentPost.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Location Badge */}
                  <div className="absolute top-8 left-8">
                    <div className="flex items-center gap-3 bg-black/5 backdrop-blur-xl border border-black/10 px-5 py-2.5 rounded-full">
                      <MapPin className="w-3.5 h-3.5 text-black/60" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/80">
                        {currentPost.userLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Narrative Panel */}
                <div className="lg:col-span-4 space-y-10">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-black/10">
                      <AvatarImage src={currentPost.userAvatar} />
                      <AvatarFallback className="bg-black/5 text-black/40 font-black">
                        {currentPost.userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tighter">
                        {currentPost.userName}
                      </h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/30">
                        Resident Collector
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-8 bg-black/40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">
                        The Narrative
                      </span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight italic text-zinc-700">
                      "{currentPost.caption}"
                    </h3>
                    <div className="space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-black/20 block">
                        Featuring Artifact
                      </span>
                      <span className="text-sm font-black uppercase tracking-widest border-b border-black/10 pb-1 inline-block">
                        {currentPost.posterName || "The Noir Series"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full h-16 rounded-full bg-black/5 backdrop-blur-md border-black/10 text-black hover:bg-black hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[10px] group"
                      onClick={() => openDetails(currentPost)}
                    >
                      Open Dialogue
                      <MessageCircle className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Button>
                    <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-black/20">
                      <span>{currentPost.commentCount || 0} Responses</span>
                      <div className="w-1 h-1 rounded-full bg-black/10" />
                      <span>{currentPost.likes} Approvals</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-4xl bg-zinc-50/50"
              >
                <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center mb-8">
                  <Camera className="w-8 h-8 text-black/20" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-black text-center">
                  The Archive is Empty
                </h3>
                <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-center max-w-sm px-6 leading-relaxed">
                  Every sanctuary deserves to be documented. Be the pioneer of
                  our community gallery.
                </p>
                {session ? (
                  <Button
                    size="lg"
                    className="bg-black text-white hover:bg-zinc-800 rounded-full px-12 h-16 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-black/10 group"
                    disabled={hasSubmitted}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    {hasSubmitted ? "Already Shared" : "Start The Archive"}
                    <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-black text-white hover:bg-zinc-800 rounded-full px-12 h-16 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-black/10 group"
                    >
                      Login to Share
                      <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mt-20 pt-10 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => i !== activeIndex && setActiveIndex(i)}
                className={cn(
                  "h-1 transition-all duration-700 rounded-full",
                  i === activeIndex
                    ? "w-12 bg-black"
                    : "w-3 bg-black/10 hover:bg-black/30"
                )}
              />
            ))}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-black/20">
            Archive Sequence
          </span>
        </div>
      </div>

      {/* Submission Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-black/5 text-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              Enter The Gallery
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
              Your setup, our archives. Standardized for excellence.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden bg-black/5 border border-black/10 border-dashed flex items-center justify-center group cursor-pointer">
              {formData.image ? (
                <>
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute top-4 right-4 bg-black/80 p-2 rounded-full border border-black/10 text-white hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center gap-4 cursor-pointer">
                  <Upload className="w-8 h-8 text-black/20 group-hover:text-black transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                    Upload Masterpiece
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <div className="space-y-4">
              <Input
                placeholder="CAPTION"
                className="bg-black/5 border-black/10 rounded-xl h-12 uppercase tracking-widest text-[10px]"
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="POSTER NAME"
                  className="bg-black/5 border-black/10 rounded-xl h-12 uppercase tracking-widest text-[10px]"
                  value={formData.posterName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      posterName: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="LOCATION"
                  className="bg-black/5 border-black/10 rounded-xl h-12 uppercase tracking-widest text-[10px]"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-zinc-800"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Request Entry"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog (Comments Only) */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md h-[70vh] p-0 bg-white border-black/5 overflow-hidden flex flex-col">
          <div className="bg-white flex flex-col flex-1">
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border border-black/10">
                  <AvatarImage src={selectedPostDetails?.userAvatar} />
                  <AvatarFallback className="bg-black/5">
                    {selectedPostDetails?.userName?.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase tracking-tighter">
                    {selectedPostDetails?.userName}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-black/30">
                    {selectedPostDetails?.userLocation}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedPostDetails?.instagramUrl && (
                  <a
                    href={selectedPostDetails.instagramUrl}
                    target="_blank"
                    className="w-10 h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {(isAdmin ||
                  (session?.user?.id &&
                    selectedPostDetails?.userId === session.user.id)) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(selectedPostDetails.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-8">
              <div className="space-y-10">
                <div className="space-y-4">
                  <span className="text-[8px] font-black uppercase tracking-widest text-black/20">
                    The Statement
                  </span>
                  <p className="text-xl font-black uppercase tracking-tighter italic text-zinc-700">
                    "{selectedPostDetails?.caption}"
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-black/40" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Public Dialogue ({comments.length})
                    </span>
                  </div>

                  <div className="space-y-8">
                    {loadingComments ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} className="flex gap-4">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={c.user?.image} />
                            <AvatarFallback className="text-[10px]">
                              {c.user?.name?.substring(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {c.user?.name}
                            </span>
                            <p className="text-xs text-black/60 leading-relaxed font-medium">
                              {c.text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-8 border-t border-black/5 bg-zinc-50/50">
              <div className="flex gap-4">
                <Input
                  placeholder="ADD TO DIALOGUE..."
                  className="bg-black/5 border-black/10 rounded-xl h-14 uppercase tracking-widest text-[9px] font-black"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                />
                <Button
                  size="icon"
                  onClick={handlePostComment}
                  className="w-14 h-14 rounded-xl bg-black text-white hover:bg-zinc-800"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              {!session && (
                <p className="text-[8px] font-black uppercase tracking-widest text-black/20 mt-4 text-center">
                  Authentication required for public dialogue.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
