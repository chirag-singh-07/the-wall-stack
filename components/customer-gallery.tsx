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
} from "@/actions/user/gallery-actions";
import { authClient } from "@/lib/auth-client";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CustomerGallery() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  // Comment/Detail Dialog states
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

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

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getApprovedGalleryPosts();
      if (result.success && result.data) {
        setPosts(result.data);
      }
      setIsLoading(false);
    };

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) return; // Already liked locally

    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });

    // Optimistic update
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );

    await likeGalleryPost(postId);
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
      toast.error("You have already submitted a post.");
      return;
    }

    if (!formData.image || !formData.caption) {
      toast.error("Please provide an image URL and caption");
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
        setFormData({
          image: "",
          caption: "",
          posterName: "",
          location: "",
          instagramUrl: "",
        });
      } else {
        toast.error("Failed to submit photo");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Double posts for infinite scroll illusion if needed, but horizontal scroll is simpler for now
  // Or implement actual marquee

  const handleOpenPost = async (post: any) => {
    setSelectedPost(post);
    setLoadingComments(true);
    const res = await getGalleryComments(post.id);
    if (res.success && res.data) {
      setComments(res.data);
    }
    setLoadingComments(false);
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !session?.user?.id || !selectedPost) return;

    const res = await addGalleryComment({
      postId: selectedPost.id,
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
      // Update post comment count locally
      setPosts(
        posts.map((p) =>
          p.id === selectedPost.id
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p
        )
      );
      toast.success("Comment added");
    } else {
      toast.error("Failed to add comment");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-20 md:py-32 bg-muted overflow-hidden relative"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-full text-sm font-medium">
                <Camera className="h-4 w-4" />
                #NOIRinHomes
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Customer Gallery
            </h2>
            <p className="text-muted-foreground mt-2">
              See how our community styles their NOIR posters
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-fit group" disabled={hasSubmitted}>
                {hasSubmitted ? "Thanks for Sharing!" : "Share Your Setup"}
                <Camera className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Share Your Setup</DialogTitle>
                <DialogDescription>
                  Upload a photo of your wall art to be featured in our gallery.
                  {hasSubmitted && (
                    <span className="block text-red-500 mt-2">
                      You have already submitted a photo.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              {!hasSubmitted && (
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Photo</Label>
                    <div className="flex items-center gap-4">
                      {formData.image && (
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={formData.image}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, image: "" })
                            }
                            className="absolute top-0 right-0 bg-black/50 text-white p-1 hover:bg-black/70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {!formData.image && (
                        <div className="flex-1">
                          <Label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload image
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                SVG, PNG, JPG or GIF
                              </p>
                            </div>
                            <Input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      placeholder="Tell us about your setup..."
                      value={formData.caption}
                      onChange={(e) =>
                        setFormData({ ...formData, caption: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="posterName">Poster Name</Label>
                      <Input
                        id="posterName"
                        placeholder="e.g. Abstract Flow"
                        value={formData.posterName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            posterName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">
                      Instagram Post URL (Optional)
                    </Label>
                    <Input
                      id="instagramUrl"
                      placeholder="https://instagram.com/p/..."
                      value={formData.instagramUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagramUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Photo"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No photos yet. Be the first!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500"
                onClick={() => handleOpenPost(post)}
              >
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.caption}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="text-white">
                    <p className="font-semibold text-lg mb-1">
                      {post.userName}
                    </p>
                    <p className="text-sm opacity-90 line-clamp-2">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                        <Heart className="h-4 w-4 fill-white" /> {post.likes}
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                        <MessageCircle className="h-4 w-4" />{" "}
                        {post.commentCount || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail & Comments Dialog */}
      <Dialog
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col md:flex-row gap-0 p-0 overflow-hidden">
          <div className="flex-1 relative bg-black">
            {selectedPost && (
              <Image
                src={selectedPost.image}
                alt={selectedPost.caption}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="w-full md:w-[400px] bg-background flex flex-col border-l">
            <div className="p-4 border-b flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedPost?.userAvatar} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedPost?.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPost?.userLocation}
                  </p>
                </div>
              </div>
              {selectedPost?.instagramUrl && (
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={selectedPost.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="mb-6">
                <p className="text-sm">{selectedPost?.caption}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Featuring: {selectedPost?.posterName}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Comments</h4>
                {loadingComments ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={c.user?.image} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-semibold">
                          {c.user?.name || "User"}
                        </p>
                        <p className="text-sm">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => selectedPost && handleLike(selectedPost.id)}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 mr-1",
                        likedPosts.has(selectedPost?.id) &&
                          "fill-red-500 text-red-500"
                      )}
                    />
                    {selectedPost?.likes +
                      (likedPosts.has(selectedPost?.id) &&
                      !posts.find(
                        (p) =>
                          p.id === selectedPost.id &&
                          p.likes > selectedPost.likes
                      )
                        ? 1
                        : 0)}{" "}
                    Likes
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-5 w-5 mr-1" />
                    {comments.length}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                />
                <Button
                  size="icon"
                  onClick={handlePostComment}
                  disabled={!session}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {!session && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Log in to like & comment
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
