import { create } from "zustand";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  pending?: boolean;
}

const createWelcomeMessage = (): ChatMessage => ({
  id: `welcome-${crypto.randomUUID?.() ?? Date.now().toString(36)}`,
  role: "assistant",
  content: "Hi there! I'm your Twinn care assistant. Ask me anything about bookings, coverage, or navigating the portal.",
  createdAt: Date.now()
});

interface ChatState {
  isOpen: boolean;
  isStreaming: boolean;
  currentPath: string;
  messages: ChatMessage[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setCurrentPath: (path: string) => void;
  addMessage: (message: ChatMessage) => void;
  resetConversation: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  isStreaming: false,
  currentPath: "/",
  messages: [createWelcomeMessage()],
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setCurrentPath: (path) => set({ currentPath: path }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  resetConversation: () => set({ messages: [createWelcomeMessage()] })
}));