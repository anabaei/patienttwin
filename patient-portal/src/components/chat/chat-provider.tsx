"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useChatStore } from "@/hooks/use-chat-store";

import { ChatFab } from "./chat-fab";
import { ChatSheet } from "./chat-sheet";

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const pathname = usePathname();
  const setCurrentPath = useChatStore((state) => state.setCurrentPath);

  useEffect(() => {
    setCurrentPath(pathname ?? "/");
  }, [pathname, setCurrentPath]);

  return (
    <>
      {children}
      <ChatFab />
      <ChatSheet />
    </>
  );
}
