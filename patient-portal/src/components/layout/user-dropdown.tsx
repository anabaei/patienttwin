'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@twinn/store';
import { Bell, LogOut, Settings, User, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserDropdownProps {
  className?: string;
}

export function UserDropdown({ className }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { account, signOut } = useAuthStore();
  
  // Mock notification count
  const unreadNotificationsCount = 2;

  const handleSignOut = () => {
    signOut();
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  if (!account) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-start space-x-2 md:space-x-3 px-3 py-3 md:px-4 md:py-4 hover:bg-accent ${className}`}
        >
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-foreground truncate">
              {account.firstName} {account.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {account.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-56"
        side="top"
        sideOffset={8}
        avoidCollisions={true}
        collisionPadding={16}
      >
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">
            {account.firstName} {account.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            {account.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleNavigation('/profile')}
          className="cursor-pointer"
        >
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigation('/notifications')}
          className="cursor-pointer"
        >
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
          {unreadNotificationsCount > 0 && (
            <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
              {unreadNotificationsCount}
            </Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigation('/settings')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
