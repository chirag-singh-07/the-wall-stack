"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllGalleryPosts, updateGalleryPostStatus, deleteGalleryPost } from "@/actions/user/gallery-actions";
import { toast } from "sonner";
import { Loader2, MoreHorizontal, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminGalleryPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    const result = await getAllGalleryPosts();
    if (result.success && result.data) {
      setPosts(result.data);
    } else {
      toast.error("Failed to fetch gallery posts");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    const result = await updateGalleryPostStatus(id, status);
    if (result.success) {
      toast.success(`Post ${status}`);
      fetchPosts();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const result = await deleteGalleryPost(id);
    if (result.success) {
      toast.success("Post deleted");
      fetchPosts();
    } else {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Customer Gallery" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Gallery Submissions</h2>
            <p className="text-sm text-muted-foreground">
              Review and moderate customer gallery posts
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post thumbnail"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{post.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {post.userLocation || "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate font-medium">
                          {post.caption}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Poster: {post.posterName || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === "approved"
                              ? "default" // Using default (black) for approved
                              : post.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className={post.status === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(post.id, "approved")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(post.id, "rejected")}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
