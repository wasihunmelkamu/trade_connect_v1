// components/interactions/comment-section.tsx
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MessageCircle, Reply } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuthUser } from "@/contexts/AuthGuard";

interface CommentSectionProps {
  postId: Id<"posts">;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<Id<"comments"> | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<Id<"comments">>>(new Set());

  const user = useAuthUser();
  const comments = useQuery(api.interactions.getComments, { postId });
  const addComment = useMutation(api.interactions.addComment);

  const toggleReplies = (commentId: Id<"comments">) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await addComment({
        userId: user.id,
        postId,
        content: newComment.trim(),
      });
      setNewComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: Id<"comments">) => {
    if (!replyContent.trim()) return;
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await addComment({
        userId: user.id,
        postId,
        content: replyContent.trim(),
        parentId,
      });
      setReplyContent("");
      setReplyTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add reply");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Sign in to join the conversation</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add new comment */}
      <Card className="border-none">
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <MessageCircle className="h-5 w-5" />
            Comments
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 border-2 border-background dark:border-gray-900">
              <AvatarFallback className="bg-primary text-white">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
              <Button
                onClick={handleSubmitComment}
                disabled={isLoading || !newComment.trim()}
                className=""
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Comment
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-200 dark:border-red-900">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Comments list */}
      {comments === undefined ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : comments.length === 0 ? (
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => {
            const authorInitials = comment.author?.displayName
              ? comment.author.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
              : "U";
            const hasReplies = comment.replies && comment.replies.length > 0;
            const isExpanded = expandedReplies.has(comment._id);

            return (
              <Card
                key={comment._id}
                className="border-none group p-2"
              >
                <CardContent className="">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 border-2 border-background dark:border-gray-900">
                      <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {comment.author?.displayName || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mb-3 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>

                      {/* Reply Button + Reply Count */}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                          className=" text-xs font-medium"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>

                        {hasReplies && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReplies(comment._id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs font-medium"
                          >
                            {isExpanded ? "Hide Replies" : `View ${comment.replies.length} Reply${comment.replies.length === 1 ? "" : "s"}`}
                          </Button>
                        )}
                      </div>

                      {/* Reply form */}
                      {replyTo === comment._id && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-800">
                          <div className="flex gap-2">
                            <Avatar className="h-6 w-6 border-2 border-background dark:border-gray-900">
                              <AvatarFallback className="text-xs">
                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                disabled={isLoading}
                                rows={2}
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSubmitReply(comment._id)}
                                  disabled={isLoading || !replyContent.trim()}
                                  className="bg-primary text-xs"
                                >
                                  {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                  Reply
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setReplyTo(null)}
                                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies — TOGGLEABLE */}
                      {hasReplies && (
                        <div
                          className={`mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-800 space-y-3 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          style={{ willChange: "opacity, max-height" }}
                        >
                          {comment.replies.map((reply) => {
                            const replyAuthorInitials = reply.author?.displayName
                              ? reply.author.displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                              : "U";

                            return (
                              <div key={reply._id} className="flex gap-3 py-2">
                                <Avatar className="h-6 w-6 border-2 border-background dark:border-gray-900">
                                  <AvatarFallback className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {replyAuthorInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-xs text-gray-900 dark:text-white">
                                      {reply.author?.displayName || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}