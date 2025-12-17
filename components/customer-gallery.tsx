"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Heart, MessageCircle, Share2, Camera, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const customerPosts = [
  {
    id: "cp1",
    user: { name: "Alex M.", avatar: "/placeholder.svg?height=40&width=40", location: "New York, USA" },
    image: "/placeholder.svg?height=600&width=600",
    likes: 234,
    comments: 18,
    caption: "Finally found the perfect piece for my living room!",
    posterName: "Geometric Harmony",
  },
  {
    id: "cp2",
    user: { name: "Sarah K.", avatar: "/placeholder.svg?height=40&width=40", location: "London, UK" },
    image: "/placeholder.svg?height=600&width=600",
    likes: 412,
    comments: 32,
    caption: "The Abstract Flow piece transforms my bedroom. Obsessed!",
    posterName: "Abstract Flow",
  },
  {
    id: "cp3",
    user: { name: "Marcus J.", avatar: "/placeholder.svg?height=40&width=40", location: "Berlin, Germany" },
    image: "/placeholder.svg?height=600&width=600",
    likes: 189,
    comments: 14,
    caption: "Home office upgrade complete. Typography perfection.",
    posterName: "Bold Statement",
  },
  {
    id: "cp4",
    user: { name: "Emma L.", avatar: "/placeholder.svg?height=40&width=40", location: "Paris, France" },
    image: "/placeholder.svg?height=600&width=600",
    likes: 567,
    comments: 45,
    caption: "Created my own gallery wall with NOIR posters",
    posterName: "Gallery Set",
  },
  {
    id: "cp5",
    user: { name: "David R.", avatar: "/placeholder.svg?height=40&width=40", location: "Tokyo, Japan" },
    image: "/placeholder.svg?height=600&width=600",
    likes: 298,
    comments: 21,
    caption: "Minimalism at its finest. Love the Silent Lines piece.",
    posterName: "Silent Lines",
  },
  {
    id: "cp6",
    user: { name: "Lisa T.", avatar: "/placeholder.svg?height=40&width=40", location: "Sydney, Australia" },
    image: "/placeholder.svg?height=600&width=600",
    likes: 345,
    comments: 27,
    caption: "Dining room vibes elevated!",
    posterName: "Void Space",
  },
]

export function CustomerGallery() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-full text-sm font-medium">
                <Camera className="h-4 w-4" />
                #NOIRinHomes
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Customer Gallery</h2>
            <p className="text-muted-foreground mt-2">See how our community styles their NOIR posters</p>
          </div>
          <Button className="w-fit group">
            Share Your Setup
            <Camera className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
          </Button>
        </div>

        {/* Masonry-style Gallery */}
        <div ref={scrollRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {customerPosts.map((post, index) => (
            <div
              key={post.id}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
              className={cn(
                "group relative rounded-xl overflow-hidden transition-all duration-700",
                index % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.caption}
                fill
                className={cn("object-cover transition-all duration-700", hoveredPost === post.id && "scale-110")}
              />

              {/* Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-foreground via-foreground/20 to-transparent transition-opacity duration-300",
                  hoveredPost === post.id ? "opacity-100" : "opacity-0",
                )}
              />

              {/* User Info - Always visible at top */}
              <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "transition-all duration-300",
                    hoveredPost === post.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                  )}
                >
                  <p className="text-background text-sm font-medium">{post.user.name}</p>
                  <p className="text-background/70 text-xs flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {post.user.location}
                  </p>
                </div>
              </div>

              {/* Content - Shows on hover */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 p-4 transition-all duration-500",
                  hoveredPost === post.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                )}
              >
                <p className="text-background text-sm mb-3 line-clamp-2">{post.caption}</p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 text-background/80 hover:text-background transition-colors"
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          likedPosts.has(post.id) && "fill-background text-background scale-110",
                        )}
                      />
                      <span className="text-sm">{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-background/80 hover:text-background transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="text-background/80 hover:text-background transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                  <span className="text-background/60 text-xs">{post.posterName}</span>
                </div>
              </div>

              {/* Animated border on hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl border-2 border-background/50 pointer-events-none transition-opacity duration-300",
                  hoveredPost === post.id ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          ))}
        </div>

        {/* Load More / Stats */}
        <div
          className={cn(
            "mt-12 flex flex-col items-center gap-6 transition-all duration-700 delay-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="flex items-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">2,400+</div>
              <div className="text-muted-foreground text-sm">Photos Shared</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-muted-foreground text-sm">Countries</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <div className="text-3xl font-bold">98%</div>
              <div className="text-muted-foreground text-sm">Happy Customers</div>
            </div>
          </div>
          <Button variant="outline" size="lg">
            View All Customer Photos
          </Button>
        </div>
      </div>
    </section>
  )
}
