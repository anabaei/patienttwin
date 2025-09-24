"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { BrainCog, Loader2, RotateCcw, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChatStore } from "@twinn/store";
import { DataStreamProvider } from "./data-stream-provider";
import { Message } from "./message";

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

const WELCOME_MESSAGE = "Hi there! I'm your Twinn care assistant. Ask me anything about bookings, coverage, or navigating the portal.";

const createWelcomeMessage = (): UIMessage => ({
  id: `welcome-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36)}`,
  role: "assistant",
  parts: [
    {
      type: "text",
      text: WELCOME_MESSAGE,
    },
  ],
});

export function ChatSheet() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isOpen = useChatStore((state) => state.isOpen);
  const setOpen = useChatStore((state) => state.setOpen);
  const setStreaming = useChatStore((state) => state.setStreaming);
  const currentPath = useChatStore((state) => state.currentPath);

  const sectionLabel = useMemo(() => formatPathLabel(currentPath), [currentPath]);
  const initialAssistantMessage = useMemo(() => createWelcomeMessage(), []);

  const [input, setInput] = useState("");
  
  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { currentPath },
    }),
    messages: [initialAssistantMessage],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage({ text: input });
        setInput("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const timeout = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [messages, isOpen]);

  useEffect(() => {
    setStreaming(status === "streaming");
  }, [status, setStreaming]);

  const handleReset = () => {
    setMessages([createWelcomeMessage()]);
    setInput("");
    setStreaming(false);
  };

  return (
    <DataStreamProvider>
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
                  <Message 
                    key={message.id} 
                    message={message} 
                    isLoading={status === "streaming" && messages.length - 1 === messages.indexOf(message)}
                    isReadonly={false}
                  />
                ))}
                {status === "streaming" && (
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
                <span>Early access · Responses use simulated Twinn data.</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleReset}
                  type="button"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
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
    </DataStreamProvider>
  );
}


