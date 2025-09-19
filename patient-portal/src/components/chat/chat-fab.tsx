"use client";

import { useSettingsStore } from "@twinn/store";
import { motion, Transition, useReducedMotion } from "framer-motion";
import { BrainCog } from "lucide-react";

import { cn } from "@/lib/utils";
import { useChatStore } from "@twinn/store";

export function ChatFab() {
  const isReducedMotion = useReducedMotion();
  const isOpen = useChatStore((state: { isOpen: boolean }) => state.isOpen);
  const toggle = useChatStore((state: { toggle: () => void }) => state.toggle);
  const chatSupport = useSettingsStore((state: { chatSupport: boolean }) => state.chatSupport);

  const isVisible = !isOpen && chatSupport;

  const animateProps = { 
    opacity: isVisible ? 1 : 0, 
    scale: isVisible ? 1 : 0.85 
  };

  const animationTransition = { duration: 0.18, ease: "easeOut" };

  return (
    <motion.button
      type="button"
      aria-label={isOpen ? "Close care assistant" : "Open care assistant"}
      aria-expanded={isOpen}
      onClick={toggle}
      className={cn(
        "fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6 md:right-6 z-[60]",
        "flex h-14 w-14 items-center justify-center rounded-full",
        "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-2xl",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      )}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={animateProps}
      transition={animationTransition as Transition}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <BrainCog className="h-6 w-6" />
      <span className="sr-only">Chat assistant</span>
    </motion.button>
  );
}
