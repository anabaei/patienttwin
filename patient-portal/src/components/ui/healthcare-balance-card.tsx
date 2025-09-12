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

interface HealthcareBalanceCardProps {
  balances: BalanceItem[];
  className?: string;
}

export function HealthcareBalanceCard({ balances, className }: HealthcareBalanceCardProps) {
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary text-lg">
          <Wallet className="h-5 w-5" />
          Your Healthcare Account Balances
        </CardTitle>
        <CardDescription>
          Use your funds for healthcare expenses and appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {balances.map((balance, index) => {
            const colors = getColorClasses(balance.color);
            return (
              <motion.div
                key={balance.label}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  colors.bg,
                  colors.border
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center space-x-3">
                  {balance.icon && (
                    <div className={cn("p-2 rounded-full bg-background/50", colors.icon)}>
                      {balance.icon}
                    </div>
                  )}
                  <div>
                    <div className={cn("text-sm font-medium", colors.text)}>
                      {balance.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {balance.description}
                    </div>
                  </div>
                </div>
                <div className={cn("text-lg sm:text-xl font-bold", colors.text)}>
                  $<CountingNumber 
                    number={balance.amount} 
                    inView={true}
                    transition={{ stiffness: 100, damping: 30 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
          <Button asChild className="flex-1 text-sm">
            <Link href="/book">
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1 text-sm">
            <Link href="/balances">
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
