import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        password: v.string(),
        role: v.union(v.literal("admin"), v.literal("user")),
    }).index("by_email", ["email"]).index("by_role", ["role"]),

    profiles: defineTable({
        userId: v.id("users"),
        name: v.string(),
        email: v.string(),
        displayName: v.string(),
        role: v.union(v.literal("admin"), v.literal("user")),
        location: v.optional(v.string()),
        isVerified: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user_id", ["userId"]),

    posts: defineTable({
        authorId: v.id("users"),
        title: v.string(),
        description: v.string(),
        content: v.string(), // Markdown content
        category: v.string(),
        tags: v.array(v.string()),
        images: v.array(v.id("_storage")),

        // Pricing & Commerce
        price: v.optional(v.number()),
        currency: v.optional(v.string()),
        isNegotiable: v.optional(v.boolean()),
        priceType: v.optional(
            v.union(v.literal("fixed"), v.literal("negotiable"), v.literal("auction"), v.literal("free")),
        ),

        // Product Details
        condition: v.optional(
            v.union(v.literal("new"), v.literal("like_new"), v.literal("good"), v.literal("fair"), v.literal("poor")),
        ),
        brand: v.optional(v.string()),
        model: v.optional(v.string()),
        quantity: v.optional(v.number()),
        dimensions: v.optional(v.string()),
        weight: v.optional(v.string()),
        color: v.optional(v.string()),
        material: v.optional(v.string()),

        // Post Type & Status
        postType: v.union(v.literal("supply"), v.literal("demand"), v.literal("service"), v.literal("exchange")),
        status: v.union(v.literal("active"), v.literal("sold"), v.literal("expired"), v.literal("paused")),
        urgency: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),

        // Location & Shipping
        location: v.optional(v.string()),
        city: v.optional(v.string()),
        country: v.optional(v.string()),
        zipCode: v.optional(v.string()),
        shippingAvailable: v.optional(v.boolean()),
        localPickupOnly: v.optional(v.boolean()),
        shippingCost: v.optional(v.number()),
        shippingRegions: v.optional(v.array(v.string())),

        // Contact & Business
        contactInfo: v.optional(v.string()),
        businessName: v.optional(v.string()),
        businessType: v.optional(v.union(v.literal("individual"), v.literal("business"), v.literal("organization"))),
        website: v.optional(v.string()),
        socialMedia: v.optional(
            v.object({
                facebook: v.optional(v.string()),
                instagram: v.optional(v.string()),
                twitter: v.optional(v.string()),
                linkedin: v.optional(v.string()),
            }),
        ),

        // Availability & Timing
        availableFrom: v.optional(v.number()),
        availableUntil: v.optional(v.number()),
        expiresAt: v.optional(v.number()),
        deliveryTime: v.optional(v.string()),

        // SEO & Metadata
        slug: v.optional(v.string()),
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        keywords: v.optional(v.array(v.string())),

        // System Fields
        isPublished: v.boolean(),
        isFeatured: v.boolean(),
        isPremium: v.optional(v.boolean()),
        viewCount: v.number(),
        likeCount: v.number(),
        commentCount: v.number(),
        favoriteCount: v.number(),
        reportCount: v.optional(v.number()),

        // Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
        publishedAt: v.optional(v.number()),
        lastBumpedAt: v.optional(v.number()),
    })
        .index("by_author", ["authorId"])
        .index("by_category", ["category"])
        .index("by_published", ["isPublished"])
        .index("by_featured", ["isFeatured"])
        .index("by_post_type", ["postType"])
        .index("by_status", ["status"])
        .index("by_location", ["city", "country"])
        .index("by_created_at", ["createdAt"])
        .index("by_expires_at", ["expiresAt"])
        .searchIndex("search_posts", {
            searchField: "title",
            filterFields: ["category", "isPublished", "postType", "status", "city", "country"],
        }),


    // Post images metadata
    images: defineTable({
        postId: v.id("posts"),
        storageId: v.id("_storage"),
        filename: v.string(),
        size: v.number(),
        mimeType: v.string(),
        alt: v.optional(v.string()),
        order: v.number(),
        createdAt: v.number(),
    })
        .index("by_post", ["postId"])
        .index("by_storage_id", ["storageId"]),


    // Comments
    comments: defineTable({
        postId: v.id("posts"),
        authorId: v.id("users"),
        content: v.string(),
        parentId: v.optional(v.id("comments")), // For nested comments
        isDeleted: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_post", ["postId"])
        .index("by_author", ["authorId"])
        .index("by_parent", ["parentId"])
        .index("by_created_at", ["createdAt"]),


    // Likes
    likes: defineTable({
        postId: v.id("posts"),
        userId: v.id("users"),
        createdAt: v.number(),
    })
        .index("by_post", ["postId"])
        .index("by_user", ["userId"])
        .index("by_post_user", ["postId", "userId"]),

    // Favorites
    favorites: defineTable({
        postId: v.id("posts"),
        userId: v.id("users"),
        createdAt: v.number(),
    })
        .index("by_post", ["postId"])
        .index("by_user", ["userId"])
        .index("by_post_user", ["postId", "userId"]),

    // Post views for analytics
    views: defineTable({
        postId: v.id("posts"),
        userId: v.optional(v.id("users")), // Optional for anonymous views
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_post", ["postId"])
        .index("by_user", ["userId"])
        .index("by_created_at", ["createdAt"]),


    // Categories
    categories: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        color: v.optional(v.string()),
        isActive: v.boolean(),
        order: v.number(),
        createdAt: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_active", ["isActive"])
        .index("by_order", ["order"]),

});

export default schema;