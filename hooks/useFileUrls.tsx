// hooks/useFileUrls.ts
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useFileUrls = (fileIds: Id<"_storage">[]) => {
  return useQuery(api.files.getUrls, { fileIds });
};