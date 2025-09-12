import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create a new post
export const createPost = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    postType: v.union(v.literal("supply"), v.literal("demand"), v.literal("service"), v.literal("exchange")),
    condition: v.optional(
      v.union(v.literal("new"), v.literal("like_new"), v.literal("good"), v.literal("fair"), v.literal("poor")),
    ),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    quantity: v.optional(v.number()),
    urgency: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    priceType: v.optional(
      v.union(v.literal("fixed"), v.literal("negotiable"), v.literal("auction"), v.literal("free")),
    ),
    isNegotiable: v.optional(v.boolean()),
    location: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    shippingAvailable: v.optional(v.boolean()),
    localPickupOnly: v.optional(v.boolean()),
    shippingCost: v.optional(v.number()),
    contactInfo: v.optional(v.string()),
    businessName: v.optional(v.string()),
    businessType: v.optional(v.union(v.literal("individual"), v.literal("business"), v.literal("organization"))),
    website: v.optional(v.string()),
    availableFrom: v.optional(v.number()),
    availableUntil: v.optional(v.number()),
    deliveryTime: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const now = Date.now()

    return await ctx.db.insert("posts", {
      authorId: userId,
      title: args.title,
      description: args.description,
      content: args.content,
      category: args.category,
      tags: args.tags,
      images: [],
      postType: args.postType,
      condition: args.condition,
      brand: args.brand,
      model: args.model,
      quantity: args.quantity,
      urgency: args.urgency,
      price: args.price,
      currency: args.currency || "USD",
      priceType: args.priceType || "fixed",
      isNegotiable: args.isNegotiable || false,
      location: args.location,
      city: args.city,
      country: args.country,
      shippingAvailable: args.shippingAvailable || false,
      localPickupOnly: args.localPickupOnly || false,
      shippingCost: args.shippingCost,
      contactInfo: args.contactInfo,
      businessName: args.businessName,
      businessType: args.businessType || "individual",
      website: args.website,
      availableFrom: args.availableFrom,
      availableUntil: args.availableUntil,
      deliveryTime: args.deliveryTime,
      status: "active",
      isPublished: args.isPublished,
      isFeatured: false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      favoriteCount: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: args.isPublished ? now : undefined,
    })
  },
})

// Update an existing post
export const updatePost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    postType: v.optional(
      v.union(v.literal("supply"), v.literal("demand"), v.literal("service"), v.literal("exchange")),
    ),
    condition: v.optional(
      v.union(v.literal("new"), v.literal("like_new"), v.literal("good"), v.literal("fair"), v.literal("poor")),
    ),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    quantity: v.optional(v.number()),
    urgency: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    priceType: v.optional(
      v.union(v.literal("fixed"), v.literal("negotiable"), v.literal("auction"), v.literal("free")),
    ),
    isNegotiable: v.optional(v.boolean()),
    location: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    shippingAvailable: v.optional(v.boolean()),
    localPickupOnly: v.optional(v.boolean()),
    shippingCost: v.optional(v.number()),
    contactInfo: v.optional(v.string()),
    businessName: v.optional(v.string()),
    businessType: v.optional(v.union(v.literal("individual"), v.literal("business"), v.literal("organization"))),
    website: v.optional(v.string()),
    availableFrom: v.optional(v.number()),
    availableUntil: v.optional(v.number()),
    deliveryTime: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    // Check if user owns the post or is admin
    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first()

    if (post.authorId !== userId && userProfile?.role !== "admin") {
      throw new Error("Not authorized to edit this post")
    }

    const now = Date.now()
    const updates: any = { updatedAt: now }

    // Update all possible fields
    if (args.title !== undefined) updates.title = args.title
    if (args.description !== undefined) updates.description = args.description
    if (args.content !== undefined) updates.content = args.content
    if (args.category !== undefined) updates.category = args.category
    if (args.tags !== undefined) updates.tags = args.tags
    if (args.postType !== undefined) updates.postType = args.postType
    if (args.condition !== undefined) updates.condition = args.condition
    if (args.brand !== undefined) updates.brand = args.brand
    if (args.model !== undefined) updates.model = args.model
    if (args.quantity !== undefined) updates.quantity = args.quantity
    if (args.urgency !== undefined) updates.urgency = args.urgency
    if (args.price !== undefined) updates.price = args.price
    if (args.currency !== undefined) updates.currency = args.currency
    if (args.priceType !== undefined) updates.priceType = args.priceType
    if (args.isNegotiable !== undefined) updates.isNegotiable = args.isNegotiable
    if (args.location !== undefined) updates.location = args.location
    if (args.city !== undefined) updates.city = args.city
    if (args.country !== undefined) updates.country = args.country
    if (args.shippingAvailable !== undefined) updates.shippingAvailable = args.shippingAvailable
    if (args.localPickupOnly !== undefined) updates.localPickupOnly = args.localPickupOnly
    if (args.shippingCost !== undefined) updates.shippingCost = args.shippingCost
    if (args.contactInfo !== undefined) updates.contactInfo = args.contactInfo
    if (args.businessName !== undefined) updates.businessName = args.businessName
    if (args.businessType !== undefined) updates.businessType = args.businessType
    if (args.website !== undefined) updates.website = args.website
    if (args.availableFrom !== undefined) updates.availableFrom = args.availableFrom
    if (args.availableUntil !== undefined) updates.availableUntil = args.availableUntil
    if (args.deliveryTime !== undefined) updates.deliveryTime = args.deliveryTime

    // Handle publishing status change
    if (args.isPublished !== undefined) {
      updates.isPublished = args.isPublished
      if (args.isPublished && !post.publishedAt) {
        updates.publishedAt = now
      }
    }

    await ctx.db.patch(args.postId, updates)
    return args.postId
  },
})

// Delete a post
export const deletePost = mutation({
  args: { postId: v.id("posts"), userId: v.id("users"), },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    // Check if user owns the post or is admin
    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first()

    if (post.authorId !== userId && userProfile?.role !== "admin") {
      throw new Error("Not authorized to delete this post")
    }

    // Delete associated images
    const images = await ctx.db
      .query("images")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect()

    for (const image of images) {
      await ctx.db.delete(image._id)
      await ctx.storage.delete(image.storageId)
    }

    // Delete the post
    await ctx.db.delete(args.postId)
  },
})

// Get user's posts
export const getUserPosts = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const currentUserId = args.userId
    if (!currentUserId) throw new Error("Not authenticated")

    const targetUserId = args.userId || currentUserId

    // If viewing another user's posts, only show published ones
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", targetUserId))
      .filter((q) =>
        targetUserId === currentUserId
          ? q.eq(q.field("authorId"), targetUserId) // Show all posts for own profile
          : q.and(q.eq(q.field("authorId"), targetUserId), q.eq(q.field("isPublished"), true)),
      )
      .order("desc")
      .collect()

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

// Get a single post by ID
export const getPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId)
    if (!post) return null

    const authorProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", post.authorId))
      .first()

    const images = await ctx.db
      .query("images")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect()

    return {
      ...post,
      author: authorProfile,
      images,
    }
  },
})

// Generate upload URL for images
export const generateUploadUrl = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    return await ctx.storage.generateUploadUrl()
  },
})

// Add image to post
export const addImageToPost = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
    storageId: v.id("_storage"),
    filename: v.string(),
    size: v.number(),
    mimeType: v.string(),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = args
    if (!userId) throw new Error("Not authenticated")

    const post = await ctx.db.get(args.postId)
    if (!post) throw new Error("Post not found")

    if (post.authorId !== userId) {
      throw new Error("Not authorized to add images to this post")
    }

    // Get current image count for ordering
    const existingImages = await ctx.db
      .query("images")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect()

    const imageId = await ctx.db.insert("images", {
      postId: args.postId,
      storageId: args.storageId,
      filename: args.filename,
      size: args.size,
      mimeType: args.mimeType,
      alt: args.alt,
      order: existingImages.length,
      createdAt: Date.now(),
    })

    // Update post images array
    const updatedImages = [...post.images, args.storageId]
    await ctx.db.patch(args.postId, { images: updatedImages })

    return imageId
  },
})
