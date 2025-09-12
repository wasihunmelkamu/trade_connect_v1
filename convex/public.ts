
import { v } from "convex/values"
import { query } from "./_generated/server"

// Get published posts with pagination and filtering
export const getPublishedPosts = query({
  args: {
    category: v.optional(v.string()),
    postType: v.optional(v.union(v.literal("supply"), v.literal("demand"), v.literal("service"), v.literal("exchange"))),
    location: v.optional(v.string()),
    priceMin: v.optional(v.number()),
    priceMax: v.optional(v.number()),
    condition: v.optional(v.union(v.literal("new"), v.literal("like_new"), v.literal("good"), v.literal("fair"), v.literal("poor"))),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 12

    let query = ctx.db.query("posts").withIndex("by_published", (q) => q.eq("isPublished", true))

    // Apply category filter
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category))
    }

    if (args.postType) {
      query = query.filter((q) => q.eq(q.field("postType"), args.postType))
    }

    if (args.location) {
      query = query.filter((q) =>
        q.or(
          q.eq(q.field("city"), args.location),
          q.eq(q.field("country"), args.location),
          q.eq(q.field("location"), args.location)
        )
      )
    }

    if (args.priceMin !== undefined || args.priceMax !== undefined) {
      query = query.filter((q) => {
        let priceFilter = q.neq(q.field("price"), undefined)
        if (args.priceMin !== undefined) {
          priceFilter = q.and(priceFilter, q.gte(q.field("price"), args.priceMin))
        }
        if (args.priceMax !== undefined) {
          priceFilter = q.and(priceFilter, q.lte(q.field("price"), args.priceMax))
        }
        return priceFilter
      })
    }

    if (args.condition) {
      query = query.filter((q) => q.eq(q.field("condition"), args.condition))
    }

    // Apply search filter
    if (args.search) {
      query = query.filter((q) =>
        q.or(
          q.eq(q.field("title"), args.search),
          q.eq(q.field("description"), args.search),
        ),
      )
    }

    const now = Date.now()
    query = query.filter((q) =>
      q.or(
        q.eq(q.field("expiresAt"), undefined),
        q.gt(q.field("expiresAt"), now)
      )
    )

    const posts = await query.order("desc").take(limit + 1) // Take one extra to check if there are more

    const hasMore = posts.length > limit
    const results = hasMore ? posts.slice(0, limit) : posts

    // Get author profiles for each post
    const postsWithAuthors = await Promise.all(
      results.map(async (post) => {
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

    return {
      posts: postsWithAuthors,
      hasMore,
      nextCursor: hasMore ? results[results.length - 1]._id : null,
    }
  },
})

// Get featured posts for homepage
export const getFeaturedPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 6

    const featuredPosts = await ctx.db
      .query("posts")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit)

    // If not enough featured posts, fill with recent posts
    if (featuredPosts.length < limit) {
      const recentPosts = await ctx.db
        .query("posts")
        .withIndex("by_published", (q) => q.eq("isPublished", true))
        .order("desc")
        .take(limit - featuredPosts.length)

      featuredPosts.push(...recentPosts.filter((post) => !featuredPosts.some((fp) => fp._id === post._id)))
    }

    // Get author profiles
    const postsWithAuthors = await Promise.all(
      featuredPosts.map(async (post) => {
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

export const getPostsByType = query({
  args: {
    postType: v.union(v.literal("supply"), v.literal("demand"), v.literal("service")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 12

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_post_type", (q) => q.eq("postType", args.postType))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit)

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

// Get posts by category
export const getPostsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 12

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit)

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

// Search posts
export const searchPosts = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20

    const results = await ctx.db
      .query("posts")
      .withSearchIndex("search_posts", (q) => q.search("title", args.query).eq("isPublished", true))
      .take(limit)

    // Get author profiles
    const postsWithAuthors = await Promise.all(
      results.map(async (post) => {
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

export const getPostStats = query({
  args: {},
  handler: async (ctx) => {
    const totalPosts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect()

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect()

    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await ctx.db
          .query("posts")
          .withIndex("by_category", (q) => q.eq("category", category.slug))
          .filter((q) => q.eq(q.field("isPublished"), true))
          .collect()

        return {
          ...category,
          postCount: count.length,
        }
      }),
    )

    const postTypeStats = await Promise.all([
      { type: "supply", label: "Supply" },
      { type: "demand", label: "Demand" },
      { type: "service", label: "Service" },
      { type: "exchange", label: "Exchange" },
    ].map(async (type) => {
      const count = await ctx.db
        .query("posts")
        .withIndex("by_post_type", (q) => q.eq("postType", type.type as any))
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect()

      return {
        type: type.type,
        label: type.label,
        count: count.length,
      }
    }))

    return {
      totalPosts: totalPosts.length,
      categories: categoryStats,
      postTypes: postTypeStats,
    }
  },
})

export const getPostsByLocation = query({
  args: {
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 12

    let query = ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("isPublished", true))

    if (args.city && args.country) {
      query = query.filter((q) =>
        q.and(
          q.eq(q.field("city"), args.city),
          q.eq(q.field("country"), args.country)
        )
      )
    } else if (args.city) {
      query = query.filter((q) => q.eq(q.field("city"), args.city))
    } else if (args.country) {
      query = query.filter((q) => q.eq(q.field("country"), args.country))
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
