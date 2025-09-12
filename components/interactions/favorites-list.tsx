"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PostCard } from "@/components/browse/post-card"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useAuthUser } from "@/contexts/AuthGuard"
import { Id } from "@/convex/_generated/dataModel"

export function FavoritesList() {
  const user = useAuthUser()
  const favorites = useQuery(api.interactions.getUserFavoritePosts, { limit: undefined, userId: user?.id as Id<"users"> })

  if (favorites === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No favorite posts yet. Start exploring to find items you love!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((post) => (
        post ? <PostCard key={post._id} post={post} /> : null
      ))}
    </div>
  )
}
