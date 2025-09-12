// app/dashboard/posts/[id]/page.tsx (or wherever your PostPage is)
"use client"

import { useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LikeButton } from "@/components/interactions/like-button"
import { FavoriteButton } from "@/components/interactions/favorite-button"
import { CommentSection } from "@/components/interactions/comment-section"
import { Loader2, Eye, MapPin, Calendar, ArrowLeft, ImageOff } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import type { Id } from "@/convex/_generated/dataModel"
import { useAuthUser } from "@/contexts/AuthGuard"
import { useFileUrls } from "@/hooks/useFileUrls"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { MarkdownRenderer } from "@/components/markdownRenderer"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function PostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as Id<"posts">
  const user = useAuthUser()
  const post = useQuery(api.posts.getPost, { postId })
  const trackView = useMutation(api.interactions.trackView)

  // Get image URLs if images exist
  const hasImages = post?.images && post.images.length > 0
  const firstImageId = hasImages ? post.images[0].storageId : null

  const files = useFileUrls(firstImageId ? [firstImageId] : [])

  const imageUrl = firstImageId ? files?.[firstImageId] : null

  const imagesObj = useFileUrls(post?.images.map(i => i.storageId) || [])

  const imageUrls = imagesObj ? Object.values(imagesObj) : []

  // Track view when post loads
  useEffect(() => {
    if (post && user) {
      trackView({ postId, userId: user.id })
    }
  }, [post, postId, trackView, user])

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
              <p className="text-muted-foreground mb-4">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const authorInitials = post.author?.displayName
    ? post.author.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "U"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* IMAGE DISPLAY SECTION */}

        <div className="relative w-full h-64 md:h-96 rounded-sm overflow-hidden mb-6">
          {hasImages ? <Carousel className="w-full">
            <CarouselContent className="-ml-1">
              {imageUrls.map((imgURL, index) => (
                <CarouselItem key={index} className="pl-1">
                  <div className="relative w-full h-64 md:h-96 rounded-sm overflow-hidden mb-6">
                    <Image
                      src={imgURL || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority // preload since it's above the fold
                    />
                  </div>

                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel> : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <ImageOff className="h-12 w-12 mb-2 opacity-60" />
                <span className="text-xs font-medium uppercase tracking-wider">Image Unavailable</span>
              </div>
            </div>
          )}
        </div>

        {/* Post header */}
        <Card className="mb-6 border-none">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-3">{post.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border-2 border-border">
                      <AvatarImage
                        // src={post.author?.avatar || undefined}
                        alt={post.author?.displayName || "User"}
                      />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author?.displayName || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.viewCount} views
                  </div>
                  {post.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {post.location}
                    </div>
                  )}
                </div>
              </div>
              {post.price && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {post.currency} {post.price}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {post.category}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground mb-4">{post.description}</p>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LikeButton postId={post._id} initialCount={post.likeCount} />
                <FavoriteButton postId={post._id} initialCount={post.favoriteCount} />
              </div>
            </div>


            {post.content && (
              <section className="mt-8 bg-neutral-50/50">
                <MarkdownRenderer>{post.content}</MarkdownRenderer>
              </section>
            )}
          </CardContent>
        </Card>

        {/* Post content */}


        {/* Contact information */}
        {post.contactInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm font-mono p-3 bg-muted rounded-md">{post.contactInfo}</div>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <CommentSection postId={post._id} />
      </div>
    </div>
  )
}
