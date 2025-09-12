// convex/files.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUrls = query({
    args: { fileIds: v.array(v.id("_storage")) },
    handler: async (ctx, args) => {
        const urls: Record<string, string> = {};
        for (const id of args.fileIds) {
            const url = await ctx.storage.getUrl(id);
            if (url) urls[id] = url;
        }
        return urls;
    },
});