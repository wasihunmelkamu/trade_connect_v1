"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, Eye, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { Id } from "@/convex/_generated/dataModel"

interface PostListProps {
  userId?: Id<"users">
}

export function PostList({ userId }: PostListProps) {
  const posts = useQuery(api.posts.getUserPosts, userId ? { userId } : {})

  if (posts === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <p className="text-muted-foreground mb-4">No posts found</p>
          <Button asChild>
            <Link href="/posts/new">Create Your First Post</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post._id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={post.isPublished ? "default" : "secondary"}>
                    {post.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant="outline">{post.category}</Badge>
                  {post.price && (
                    <Badge variant="outline">
                      {post.currency} {post.price}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/posts/${post._id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/posts/${post._id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3 mb-4">{post.description}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likeCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.commentCount}
                </span>
              </div>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
