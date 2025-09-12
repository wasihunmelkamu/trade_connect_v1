// app/api/auth/convexAuth.ts
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      validatePasswordRequirements(password) {
        if (password.trim().length < 4) {
          return "Password must be at least 4 characters";
        }
        return null;
      },
    }),
  ],
  callbacks: {
    afterUserCreatedOrUpdated: async (ctx, args) => {
      const { userId, profile } = args;


      if (!userId) throw new Error("User ID missing");
      if (!profile?.email) throw new Error("Email missing from profile");

      const now = Date.now();

      // Check if profile already exists
      const existingProfile = await ctx.db
        .query("profiles")
        // @ts-ignore: Convex type limitation — "userId" is valid
        .withIndex("by_user_id", (q) => q.eq("userId", userId))
        .first();

      if (existingProfile) {
        // Update timestamp only (or extend with other logic)
        await ctx.db.patch(existingProfile._id, {
          updatedAt: now,
        });
        console.log(`🔁 Updated profile for user ${userId}`);
        return existingProfile._id;
      } else {
        // Create new profile using data from auth profile
        const newProfileId = await ctx.db.insert("profiles", {
          userId: userId,
          displayName: profile.email.split("@")[0],
          email: profile.email,
          role: "user",
          isVerified: false,
          createdAt: now,
          updatedAt: now,
        });

        console.log(`✅ Created profile for user ${userId}`);
        return newProfileId;
      }
    },
  },
});