"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { BrainCog, Loader2, RotateCcw, Send } from "lucide-react";

import { useChatStore, type ChatMessage } from "@/hooks/use-chat-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

const formatPathLabel = (path: string) => {
  if (!path || path === "/") {
    return "Home";
  }

  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, " "))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
};

export function ChatSheet() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messages = useChatStore((state) => state.messages);
  const isOpen = useChatStore((state) => state.isOpen);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const setOpen = useChatStore((state) => state.setOpen);
  const addMessage = useChatStore((state) => state.addMessage);
  const resetConversation = useChatStore((state) => state.resetConversation);
  const currentPath = useChatStore((state) => state.currentPath);

  const sectionLabel = useMemo(() => formatPathLabel(currentPath), [currentPath]);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [messages, isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = Date.now();
    addMessage({
      id: `user-${crypto.randomUUID?.() ?? now.toString(36)}`,
      role: "user",
      content: trimmed,
      createdAt: now
    });

    setInput("");

    addMessage({
      id: `assistant-draft-${crypto.randomUUID?.() ?? (now + 1).toString(36)}`,
      role: "assistant",
      content: "I'm getting set up to help—AI responses will appear here soon.",
      createdAt: Date.now()
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className={cn(
          "h-[88vh] max-h-[calc(100vh-4rem)] w-full gap-0 rounded-t-3xl border-t border-border p-0",
          "pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        )}
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BrainCog className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <SheetTitle className="text-base font-semibold">Care Assistant</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Currently viewing: {sectionLabel}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-6 py-5 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isStreaming && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-border px-6 pt-4">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Preview build · Responses are simulated.</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={resetConversation}
                type="button"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the assistant to help with booking, coverage, or navigation..."
                rows={2}
              />
              <div className="flex items-center justify-end">
                <Button type="submit" disabled={!input.trim()} className="gap-2">
                  Send
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
