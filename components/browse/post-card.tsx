// components/PostCard.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Eye, MessageCircle, MapPin, ImageOff } from "lucide-react";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import { useFileUrls } from "@/hooks/useFileUrls";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface PostCardProps {
  post: Doc<"posts"> & {
    author: Doc<"profiles"> | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  const authorInitials = post.author?.name
    ? post.author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const hasImages = post.images && post.images.length > 0;
  const firstImageId = hasImages ? post.images[0] : null;

  const files = useFileUrls(
    firstImageId ? [firstImageId] : []
  );

  const imageUrl = firstImageId ? files?.[firstImageId] : null;

  return (
    <Card className="">
      <Link href={`/dashboard/posts/${post._id}`} className="block">
        {/* IMAGE SECTION */}
        <div className="relative h-48 overflow-hidden bg-gray-50 dark:bg-gray-900">
          { imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageOff className="h-12 w-12 mb-2 opacity-60" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  No Image
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <CardHeader className="pb-3 px-5 pt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <p className="text-sm  line-clamp-2 mt-1.5 text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
            </div>
            {post.price && (
              <Badge
                variant="secondary"
                className="ml-2 shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                {post.currency} {post.price}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-5 pb-4">
          {/* AUTHOR + CATEGORY */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-7 w-7 border-2 border-white dark:border-gray-800">
                <AvatarImage
                  // src={post.author?.avatar || undefined}
                  alt={post.author?.name || "User"}
                />
                <AvatarFallback className="text-xs bg-indigo-500 text-white">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {post.author?.name || "Anonymous"}
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {post.category}
            </Badge>
          </div>

          {/* LOCATION (if exists) */}
          {post.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span>{post.location}</span>
            </div>
          )}

          {/* STATS + DATE */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Eye className="h-3.5 w-3.5" />
                <span>{post.viewCount}</span>
              </span>
              <span className="flex items-center gap-1 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                <Heart className="h-3.5 w-3.5" />
                <span>{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{post.commentCount}</span>
              </span>
            </div>
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>

          {/* TAGS */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs font-normal border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}