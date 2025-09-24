"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UIMessage } from "ai";
import { EditIcon, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";

type MessageActionsProps = {
  message: UIMessage;
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
};

export function MessageActions({ message, mode, setMode }: MessageActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (message.role !== "user") {
    return null;
  }

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover/message:opacity-100 transition-opacity">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setMode("edit");
              setIsOpen(false);
            }}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
