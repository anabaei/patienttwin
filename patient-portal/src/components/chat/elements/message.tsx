"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";

type MessageContentProps = ComponentProps<"div">;

export const MessageContent = memo(
  ({ className, ...props }: MessageContentProps) => (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-4 prose-headings:mb-2",
        "prose-p:text-foreground prose-p:leading-relaxed prose-p:my-2",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:my-4",
        "prose-ul:text-foreground prose-ol:text-foreground prose-ul:my-2 prose-ol:my-2",
        "prose-li:text-foreground prose-li:marker:text-muted-foreground prose-li:my-1",
        "prose-blockquote:text-muted-foreground prose-blockquote:border-l-border prose-blockquote:my-4",
        "prose-hr:border-border prose-hr:my-4",
        "prose-table:text-foreground prose-th:text-foreground prose-td:text-foreground prose-table:my-4",
        "prose-th:border-border prose-td:border-border",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

MessageContent.displayName = "MessageContent";
