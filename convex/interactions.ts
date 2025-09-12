import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

// Like/Unlike a post
export const toggleLike = mutation({
  args: { userId: v.id("users"), postId: v.id("posts") },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_user", (q) => q.eq("postId", args.postId).eq("userId", userId))
      .first()

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id)
      await ctx.db.patch(args.postId, {
        likeCount: Math.max(0, post.likeCount - 1),
      })
      return { liked: false, count: Math.max(0, post.likeCount - 1) }
    } else {
      // Like
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId,
        createdAt: Date.now(),
      })
      await ctx.db.patch(args.postId, {
        likeCount: post.likeCount + 1,
      })
      return { liked: true, count: post.likeCount + 1 }
    }
  },
})

// Add/Remove favorite
export const toggleFavorite = mutation({
  args: { userId: v.id("users"), postId: v.id("posts") },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const existingFavorite = await ctx.db
      .query("favorites")
      .withIndex("by_post_user", (q) => q.eq("postId", args.postId).eq("userId", userId))
      .first()

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    if (existingFavorite) {
      // Remove favorite
      await ctx.db.delete(existingFavorite._id)
      await ctx.db.patch(args.postId, {
        favoriteCount: Math.max(0, post.favoriteCount - 1),
      })
      return { favorited: false, count: Math.max(0, post.favoriteCount - 1) }
    } else {
      // Add favorite
      await ctx.db.insert("favorites", {
        postId: args.postId,
        userId,
        createdAt: Date.now(),
      })
      await ctx.db.patch(args.postId, {
        favoriteCount: post.favoriteCount + 1,
      })
      return { favorited: true, count: post.favoriteCount + 1 }
    }
  },
})

// Add a comment
export const addComment = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
    parentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: userId,
      content: args.content.trim(),
      parentId: args.parentId,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    // Update post comment count
    await ctx.db.patch(args.postId, {
      commentCount: post.commentCount + 1,
    })

    return commentId
  },
})

// Get comments for a post
export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .order("asc")
      .collect()

    // Get author profiles for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const authorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", comment.authorId))
          .first()

        return {
          ...comment,
          author: authorProfile,
        }
      }),
    )

    // Organize comments into threads
    const topLevelComments = commentsWithAuthors.filter((c) => !c.parentId)
    const replies = commentsWithAuthors.filter((c) => c.parentId)

    const threaded = topLevelComments.map((comment) => ({
      ...comment,
      replies: replies.filter((r) => r.parentId === comment._id),
    }))

    return threaded
  },
})

// Track post view
export const trackView = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = args

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    // Check if this user/IP has viewed recently (within 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentView = await ctx.db
      .query("views")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), oneHourAgo),
          userId ? q.eq(q.field("userId"), userId) : q.eq(q.field("ipAddress"), args.ipAddress),
        ),
      )
      .first()

    if (!recentView) {
      // Record new view
      await ctx.db.insert("views", {
        postId: args.postId,
        userId: userId || undefined,
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        createdAt: Date.now(),
      })

      // Update post view count
      await ctx.db.patch(args.postId, {
        viewCount: post.viewCount + 1,
      })
    }
  },
})

// Check user's interaction status with a post
export const getUserInteractions = query({
  args: { userId: v.optional(v.id("users")), postId: v.id("posts") },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) return { liked: false, favorited: false }

    const [like, favorite] = await Promise.all([
      ctx.db
        .query("likes")
        .withIndex("by_post_user", (q) => q.eq("postId", args.postId).eq("userId", userId))
        .first(),
      ctx.db
        .query("favorites")
        .withIndex("by_post_user", (q) => q.eq("postId", args.postId).eq("userId", userId))
        .first(),
    ])

    return {
      liked: !!like,
      favorited: !!favorite,
    }
  },
})

// Get user's liked posts
export const getUserLikedPosts = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const limit = args.limit || 20

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit)

    const posts = await Promise.all(
      likes.map(async (like) => {
        const post = await ctx.db.get(like.postId)
        if (!post || !post.isPublished) return null

        const authorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", post.authorId))
          .first()

        return {
          ...post,
          author: authorProfile,
          likedAt: like.createdAt,
        }
      }),
    )

    return posts.filter(Boolean)
  },
})

// Get user's favorite posts
export const getUserFavoritePosts = query({
  args: { limit: v.optional(v.number()), userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = args.userId
    if (!userId) throw new Error("Not authenticated")

    const limit = args.limit || 20

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit)

    const posts = await Promise.all(
      favorites.map(async (favorite) => {
        const post = await ctx.db.get(favorite.postId)
        if (!post || !post.isPublished) return null

        const authorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", post.authorId))
          .first()

        return {
          ...post,
          author: authorProfile,
          favoritedAt: favorite.createdAt,
        }
      }),
    )

    return posts.filter(Boolean)
  },
})
