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
  toggleGalleryLike,
  getUserLikedPostIds,
  checkUserSubmissionStatus,
  addGalleryComment,
  getGalleryComments,
  deleteGalleryPost,
} from "@/actions/user/gallery-actions";
import { authClient } from "@/lib/auth-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { DUMMY_POSTS } from "@/data";

export function CustomerGallery() {
  const [posts, setPosts] = useState<any[]>([]);

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
    try {
      const result = await getApprovedGalleryPosts();
      if (result.success && result.data && result.data.length > 0) {
        setPosts(result.data);
      } else {
        setPosts(DUMMY_POSTS);
      }
    } catch (e) {
      setPosts(DUMMY_POSTS);
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

    if (session?.user?.id) {
      getUserLikedPostIds(session.user.id).then((res) => {
        if (res.success && res.likedPostIds) {
          setLikedPosts(new Set(res.likedPostIds));
        }
      });
    }
  }, [session?.user?.id]);

  const handleLike = async (postId: string) => {
    if (postId.startsWith("dummy")) {
      toast("This is a demo post. Likes are disabled.");
      return;
    }

    if (!session?.user?.id) {
      toast.error("Please login to like posts");
      return;
    }

    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);

    // Optimistic Update
    setPosts((current) =>
      current.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p
      )
    );

    const res = await toggleGalleryLike(session.user.id, postId);
    if (!res.success) {
      // Revert if failed
      setLikedPosts(likedPosts);
      setPosts((current) =>
        current.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p
        )
      );
      toast.error("Failed to update like");
    }
  };

  const handleDelete = async (postId: string) => {
    if (postId.startsWith("dummy")) return;
    if (!confirm("Are you sure you want to delete this gallery post?")) return;

    const res = await deleteGalleryPost(postId);
    if (res.success) {
      toast.success("Post deleted");
      setPosts(posts.filter((p) => p.id !== postId));
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
    if (selectedPostDetails?.id?.startsWith("dummy")) {
      toast("This is a demo post. Comments are disabled.");
      return;
    }
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

  if (isLoading)
    return (
      <div className="h-[80vh] flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black/20" />
      </div>
    );

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
              Community <span className="text-zinc-400 italic">Gallery</span>
            </h2>
            <p className="text-zinc-500 max-w-lg text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Explore how our global community styles their spaces. Discover
              ideas, save your favorites, and shop the look.
            </p>
          </motion.div>

          <Button
            size="lg"
            className="bg-black text-white hover:bg-zinc-800 rounded-full px-8 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg"
            onClick={() => {
              if (session) {
                if (!hasSubmitted) setIsDialogOpen(true);
              } else {
                toast.error("Please login to share");
              }
            }}
            disabled={hasSubmitted}
          >
            {hasSubmitted ? "Values Shared" : "Share Your Setup"}
            <Camera className="ml-3 w-4 h-4" />
          </Button>
        </div>

        {/* Pinterest Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pb-20">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in bg-zinc-100 mb-4"
              onClick={() => openDetails(post)}
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-auto object-cover"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className={cn(
                      "h-9 px-4 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all",
                      likedPosts.has(post.id)
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                  >
                    {likedPosts.has(post.id) ? "Saved" : "Save"}
                  </Button>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 border border-white/20">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback className="text-[8px] bg-black/50 text-white">
                        {post.userName?.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-bold truncate max-w-[80px]">
                      {post.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-full">
                    <Heart
                      className={cn(
                        "w-3 h-3 fill-current",
                        likedPosts.has(post.id) ? "text-red-500" : "text-white"
                      )}
                    />
                    <span className="text-[9px] font-bold">{post.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
              <DialogTitle className="sr-only">
                Gallery Post by {selectedPostDetails?.userName}
              </DialogTitle>
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

                  {selectedPostDetails?.posterName && (
                    <Link
                      href={`/shop?search=${encodeURIComponent(
                        selectedPostDetails.posterName
                      )}`}
                      className="block mt-4"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                      >
                        Shop This Look
                        <ArrowRight className="ml-2 w-3 h-3" />
                      </Button>
                    </Link>
                  )}
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
