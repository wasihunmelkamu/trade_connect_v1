import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

// Get all active categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("asc")
      .collect()
  },
})

// Create category (admin only)
export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first()

    if (!userProfile || userProfile.role !== "admin") {
      throw new Error("Not authorized")
    }

    // Get current category count for ordering
    const existingCategories = await ctx.db.query("categories").collect()

    return await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      icon: args.icon,
      color: args.color,
      isActive: true,
      order: existingCategories.length,
      createdAt: Date.now(),
    })
  },
})

// Seed default categories
export const seedCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first()

    if (!userProfile || userProfile.role !== "admin") {
      throw new Error("Not authorized")
    }

    const existingCategories = await ctx.db.query("categories").collect()
    if (existingCategories.length > 0) {
      return "Categories already exist"
    }

    const defaultCategories = [
      { name: "Electronics", slug: "electronics", icon: "Smartphone", color: "#3B82F6" },
      { name: "Fashion", slug: "fashion", icon: "Shirt", color: "#EC4899" },
      { name: "Home & Garden", slug: "home-garden", icon: "Home", color: "#10B981" },
      { name: "Automotive", slug: "automotive", icon: "Car", color: "#F59E0B" },
      { name: "Sports", slug: "sports", icon: "Trophy", color: "#8B5CF6" },
      { name: "Books", slug: "books", icon: "Book", color: "#EF4444" },
      { name: "Services", slug: "services", icon: "Briefcase", color: "#06B6D4" },
      { name: "Real Estate", slug: "real-estate", icon: "Building", color: "#84CC16" },
    ]

    for (let i = 0; i < defaultCategories.length; i++) {
      const category = defaultCategories[i]
      await ctx.db.insert("categories", {
        ...category,
        isActive: true,
        order: i,
        createdAt: Date.now(),
      })
    }

    return "Categories seeded successfully"
  },
})
