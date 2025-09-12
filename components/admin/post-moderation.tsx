"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Star, StarOff, Trash2, Eye, Edit } from "lucide-react"
import Link from "next/link"
import type { Id } from "@/convex/_generated/dataModel"

export function PostModeration() {
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "featured">("all")
  const posts = useQuery(api.admin.getAllPostsForAdmin, { filter, limit: 50 })
  const toggleFeatured = useMutation(api.admin.togglePostFeatured)
  const deletePost = useMutation(api.admin.deletePostAsAdmin)

  const handleToggleFeatured = async (postId: Id<"posts">) => {
    try {
      await toggleFeatured({ postId })
    } catch (error) {
      console.error("Failed to toggle featured status:", error)
    }
  }

  const handleDeletePost = async (postId: Id<"posts">) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deletePost({ postId })
      } catch (error) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">Post Moderation</CardTitle>
        <div className="flex gap-4">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {posts === undefined ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No posts found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => {
                const authorInitials = post.author?.name
                  ? post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"

                return (
                  <TableRow key={post._id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium line-clamp-1">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{post.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {/* <AvatarImage src={post.author?.avatar || "/placeholder.svg"} /> */}
                          <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{post.author?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={post.isPublished ? "default" : "secondary"}>
                          {post.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {post.isFeatured && (
                          <Badge variant="outline" className="text-yellow-600">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{post.viewCount} views</div>
                        <div>{post.likeCount} likes</div>
                        <div>{post.commentCount} comments</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/posts/${post._id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/posts/${post._id}/edit`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleFeatured(post._id)}>
                          {post.isFeatured ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
