import { GenericId, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
// Check if user is admin
const requireAdmin = async (ctx: any) => {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new Error("Not authenticated")

  const userProfile = await ctx.db
    .query("profiles")
    .withIndex("by_user_id", (q: { eq: (arg0: string, arg1: GenericId<"users">) => any }) => q.eq("userId", userId))
    .first()

  if (!userProfile || userProfile.role !== "admin") {
    throw new Error("Admin access required")
  }

  return { userId, userProfile }
}
// Get platform analytics
export const getPlatformAnalytics = query({
  args: {},
  handler: async (ctx) => {
    // await requireAdmin(ctx)

    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

    // Get total counts
    const [totalUsers, totalPosts, totalComments, totalViews] = await Promise.all([
      ctx.db.query("profiles").collect(),
      ctx.db.query("posts").collect(),
      ctx.db.query("comments").collect(),
      ctx.db.query("views").collect(),
    ])
    // Get recent activity
    const [recentUsers, recentPosts, recentComments, recentViews] = await Promise.all([
      ctx.db
        .query("profiles")
        .filter((q) => q.gte(q.field("createdAt"), thirtyDaysAgo))
        .collect(),
      ctx.db
        .query("posts")
        .filter((q) => q.gte(q.field("createdAt"), thirtyDaysAgo))
        .collect(),
      ctx.db
        .query("comments")
        .filter((q) => q.gte(q.field("createdAt"), thirtyDaysAgo))
        .collect(),
      ctx.db
        .query("views")
        .filter((q) => q.gte(q.field("createdAt"), sevenDaysAgo))
        .collect(),
    ])

    // Get category statistics
    const categories = await ctx.db.query("categories").collect()
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const posts = await ctx.db
          .query("posts")
          .withIndex("by_category", (q) => q.eq("category", category.slug))
          .collect()
        return {
          name: category.name,
          count: posts.length,
          published: posts.filter((p) => p.isPublished).length,
        }
      }),
    )

    // Calculate growth rates
    const weeklyUsers = recentUsers.filter((u) => u.createdAt >= sevenDaysAgo).length
    const weeklyPosts = recentPosts.filter((p) => p.createdAt >= sevenDaysAgo).length

    return {
      totals: {
        users: totalUsers.length,
        posts: totalPosts.length,
        publishedPosts: totalPosts.filter((p) => p.isPublished).length,
        comments: totalComments.length,
        views: totalViews.length,
      },
      recent: {
        users30d: recentUsers.length,
        posts30d: recentPosts.length,
        comments30d: recentComments.length,
        views7d: recentViews.length,
        users7d: weeklyUsers,
        posts7d: weeklyPosts,
      },
      categories: categoryStats,
    }
  },
})

// Get all users for management
export const getAllUsersForAdmin = query({
  args: {
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx)

    const limit = args.limit || 50

    let query = ctx.db.query("profiles")

    if (args.search) {
      query = query.filter((q) => q.or(q.eq(q.field("displayName"), args.search), q.eq(q.field("email"), args.search)))
    }

    const users = await query.order("desc").take(limit)

    // Get post counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const posts = await ctx.db
          .query("posts")
          .withIndex("by_author", (q) => q.eq("authorId", user.userId))
          .collect()

        return {
          ...user,
          postCount: posts.length,
          publishedPostCount: posts.filter((p) => p.isPublished).length,
        }
      }),
    )

    return usersWithStats
  },
})

// Get all posts for moderation
export const getAllPostsForAdmin = query({
  args: {
    limit: v.optional(v.number()),
    filter: v.optional(v.union(v.literal("all"), v.literal("published"), v.literal("draft"), v.literal("featured"))),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx)

    const limit = args.limit || 50
    let query

    // Apply filters
    switch (args.filter) {
      case "published":
        query = ctx.db.query("posts").withIndex("by_published", (q) => q.eq("isPublished", true))
        break
      case "draft":
        query = ctx.db.query("posts").withIndex("by_published", (q) => q.eq("isPublished", false))
        break
      case "featured":
        query = ctx.db.query("posts").withIndex("by_featured", (q) => q.eq("isFeatured", true))
        break
      default:
        // All posts
        query = ctx.db.query("posts")
        break
    }

    const posts = await query.order("desc").take(limit)

    // Get author profiles
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const authorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", post.authorId))
          .first()

        return {
          ...post,
          author: authorProfile,
        }
      }),
    )

    return postsWithAuthors
  },
})
// Toggle post featured status
export const togglePostFeatured = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx)

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    await ctx.db.patch(args.postId, {
      isFeatured: !post.isFeatured,
      updatedAt: Date.now(),
    })

    return !post.isFeatured
  },
})

// Update user verification status
export const toggleUserVerification = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx)

    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first()

    if (!userProfile) throw new Error("User profile not found")

    await ctx.db.patch(userProfile._id, {
      isVerified: !userProfile.isVerified,
      updatedAt: Date.now(),
    })

    return !userProfile.isVerified
  },
})
// Delete post (admin)
export const deletePostAsAdmin = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx)
    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    // Delete associated data
    const [images, comments, likes, favorites, views] = await Promise.all([
      ctx.db
        .query("images")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect(),
      ctx.db
        .query("comments")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect(),
      ctx.db
        .query("likes")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect(),
      ctx.db
        .query("favorites")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect(),
      ctx.db
        .query("views")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect(),
    ])

    // Delete all associated data
    await Promise.all([
      ...images.map((img) => ctx.db.delete(img._id)),
      ...images.map((img) => ctx.storage.delete(img.storageId)),
      ...comments.map((comment) => ctx.db.delete(comment._id)),
      ...likes.map((like) => ctx.db.delete(like._id)),
      ...favorites.map((fav) => ctx.db.delete(fav._id)),
      ...views.map((view) => ctx.db.delete(view._id)),
    ])

    // Delete the post
    await ctx.db.delete(args.postId)
  },
})

// Get recent activity feed
export const getRecentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx)

    const limit = args.limit || 20
    const activities = []

    // Get recent posts
    const recentPosts = await ctx.db
      .query("posts")
      .order("desc")
      .take(limit / 2)

    for (const post of recentPosts) {
      const author = await ctx.db
        .query("profiles")
        .withIndex("by_user_id", (q) => q.eq("userId", post.authorId))
        .first()

      activities.push({
        id: post._id,
        type: "post",
        action: post.isPublished ? "published" : "created",
        user: author?.displayName || "Unknown",
        title: post.title,
        timestamp: post.createdAt,
      })
    }
    // Get recent users
    const recentUsers = await ctx.db
      .query("profiles")
      .order("desc")
      .take(limit / 2)

    for (const user of recentUsers) {
      activities.push({
        id: user._id,
        type: "user",
        action: "joined",
        user: user.displayName,
        title: `New user: ${user.displayName}`,
        timestamp: user.createdAt,
      })
    }

    // Sort by timestamp and limit
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
  },
})
