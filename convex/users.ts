import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  async handler(ctx, { name, email, password }) {
    const userId = await ctx.db.insert("users", {
      name,
      email,
      password,
      role: "user"
    })

    const newUser = await ctx.db.get(userId)
    return newUser
  },
})

export const getUserByEmail = query({
  args: { email: v.string() },
  async handler(ctx, { email }) {
    const user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", email)).unique()
    return user

  },
})

// Get current user profile
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId } = args
    console.log({ userId })

    if (!userId) return null

    const user = await ctx.db.get(userId)
    if (!user) return null

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first()

    return {
      ...profile,
      ...user,
      _id: user._id,
      role: user.role
    }
  },
})
// Get current user profile
export const getCurrentUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId } = args
    console.log({ userId })

    if (!userId) return null

    const user = await ctx.db.get(userId)
    if (!user) return null

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first()

    return {
      profile,
      ...user,
    }
  },
})

// Create or update user profile
export const createProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = args
    const user = await ctx.db.get(userId)
    if (!user) throw new Error("User not found")

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first()


    if (existingProfile) {
      throw new Error("Profile already existes")
    }
    // Create new profile
    const now = Date.now()
    const displayName = args.email.split('@')[0]
    return await ctx.db.insert("profiles", {
      userId,
      name: args.name,
      email: args.email,
      role: "user",
      displayName,
      location: args.location,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Get all users (admin only)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect()
    return profiles
  },
})
