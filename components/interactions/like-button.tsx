"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Id } from "@/convex/_generated/dataModel"
import { useAuthUser } from "@/contexts/AuthGuard"

interface LikeButtonProps {
  postId: Id<"posts">
  initialCount: number
  className?: string
}

export function LikeButton({ postId, initialCount, className }: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toggleLike = useMutation(api.interactions.toggleLike)
  const user = useAuthUser()
  
  const userInteractions = useQuery(api.interactions.getUserInteractions, { postId, userId: user?.id! })

  const handleLike = async () => {
    if (!user) {
      return;
    }
    setIsLoading(true)
    try {
      await toggleLike({ postId, userId: user.id })
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isLiked = userInteractions?.liked || false
  const likeCount = initialCount

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn("flex items-center gap-2", className)}
    >
      <Heart
        className={cn("h-4 w-4 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")}
      />
      <span className="text-sm">{likeCount}</span>
    </Button>
  )
}
