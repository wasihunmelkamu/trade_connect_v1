// components/MarkdownRenderer.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils"; // adjust path if needed

interface MarkdownRendererProps {
    children: string;
    className?: string;
}

export function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
                h1: ({ node, ...props }) => (
                    <h1 className="mt-6 mb-3 text-3xl font-bold text-gray-900 dark:text-white" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="mt-5 mb-2.5 text-2xl font-semibold text-gray-900 dark:text-white" {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <h3 className="mt-4 mb-2 text-xl font-semibold text-gray-900 dark:text-white" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul className="my-4 ml-6 list-disc space-y-1 text-gray-700 dark:text-gray-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol className="my-4 ml-6 list-decimal space-y-1 text-gray-700 dark:text-gray-300" {...props} />
                ),
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                blockquote: ({ node, ...props }) => (
                    <blockquote
                        className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-700 dark:text-gray-400"
                        {...props}
                    />
                ),
                a: ({ node, ...props }) => (
                    <a
                        className="text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                    />
                ),
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                        <SyntaxHighlighter
                            // @ts-ignore
                            style={tomorrow} // Fix for TS error — see note below
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !my-2 !text-sm"
                            {...props}
                        >
                            {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    ) : (
                        <code
                            className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                pre: ({ node, ...props }) => (
                    <pre className="!my-4 !overflow-x-auto rounded-lg" {...props} />
                ),
                img: ({ node, ...props }) => (
                    <img
                        className="my-4 max-w-full rounded-lg border border-gray-200 shadow-sm dark:border-gray-800"
                        loading="lazy"
                        {...props}
                    />
                ),
                table: ({ node, ...props }) => (
                    <div className="my-4 overflow-x-auto">
                        <table className="min-w-full rounded-lg border border-gray-200 dark:border-gray-800" {...props} />
                    </div>
                ),
                th: ({ node, ...props }) => (
                    <th className="border border-gray-200 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200" {...props} />
                ),
                td: ({ node, ...props }) => (
                    <td className="border border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-800 dark:text-gray-300" {...props} />
                ),
            }}

            // className={cn("prose prose-sm max-w-none dark:prose-invert", className)}
        >
            {children}
        </ReactMarkdown>
    );
}