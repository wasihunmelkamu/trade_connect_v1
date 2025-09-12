import { Id } from "@/convex/_generated/dataModel";

export type AuthUser = {
    id: Id<"users">;
    name: string;
    email: string;
    role: "admin" | "user";
    creationTime: number;
}