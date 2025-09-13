"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Wallet } from "lucide-react";
import Link from "next/link";

interface BalanceItem {
  label: string;
  amount: number;
  description: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "accent";
}

interface CompactBalanceCardProps {
  balances: BalanceItem[];
  className?: string;
}

export function CompactBalanceCard({ balances, className }: CompactBalanceCardProps) {
  const getColorClasses = (color: BalanceItem["color"]) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary/10",
          border: "border-primary/20",
          text: "text-primary",
          icon: "text-primary"
        };
      case "secondary":
        return {
          bg: "bg-secondary/10",
          border: "border-secondary/20", 
          text: "text-secondary-foreground",
          icon: "text-secondary-foreground"
        };
      case "accent":
        return {
          bg: "bg-accent/10",
          border: "border-accent/30",
          text: "text-accent-foreground",
          icon: "text-accent-foreground"
        };
      default:
        return {
          bg: "bg-muted/10",
          border: "border-muted/20",
          text: "text-foreground",
          icon: "text-muted-foreground"
        };
    }
  };

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-primary text-base">
          <Wallet className="h-4 w-4" />
          Account Balances
        </CardTitle>
        <CardDescription className="text-sm">
          HSA, WSA, and other healthcare accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {balances.map((balance, index) => {
            const colors = getColorClasses(balance.color);
            return (
              <motion.div
                key={balance.label}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border text-center",
                  colors.bg,
                  colors.border
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {balance.icon && (
                  <div className={cn("p-1.5 rounded-full bg-background/50 mb-2", colors.icon)}>
                    {balance.icon}
                  </div>
                )}
                <div className={cn("text-xs font-medium mb-1", colors.text)}>
                  {balance.label}
                </div>
                <div className={cn("text-lg font-bold", colors.text)}>
                  $<CountingNumber 
                    number={balance.amount} 
                    inView={true}
                    transition={{ stiffness: 100, damping: 30 }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {balance.description}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Compact Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button asChild size="sm" className="flex-1 text-xs">
            <Link href="/book">
              <Plus className="h-3 w-3 mr-1" />
              Book
            </Link>
          </Button>
          <Button variant="outline" asChild size="sm" className="flex-1 text-xs">
            <Link href="/balances">
              Details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
