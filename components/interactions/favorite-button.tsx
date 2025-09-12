"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Id } from "@/convex/_generated/dataModel"
import { useAuthUser } from "@/contexts/AuthGuard"

interface FavoriteButtonProps {
  postId: Id<"posts">
  initialCount: number
  className?: string
}

export function FavoriteButton({ postId, initialCount, className }: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toggleFavorite = useMutation(api.interactions.toggleFavorite)
  
  const user = useAuthUser()
  const userInteractions = useQuery(api.interactions.getUserInteractions, { postId, userId: user?.id })

  const handleFavorite = async () => {
    if (!user) {
      return;
    }
    setIsLoading(true)
    try {

      await toggleFavorite({ postId, userId: user.id })
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFavorited = userInteractions?.favorited || false

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleFavorite}
      disabled={isLoading}
      className={cn("flex items-center gap-2", className)}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-colors",
          isFavorited ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground",
        )}
      />
      <span className="text-sm">{initialCount}</span>
    </Button>
  )
}
