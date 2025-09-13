"use client";

import { motion } from "framer-motion";
import { ArrowRight, DollarSign, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";

interface BalanceSummary {
  hsa: number;
  wsa: number;
  total: number;
}

interface CompactBalanceSummaryProps {
  balances: BalanceSummary;
  showDetails?: boolean;
}

export function CompactBalanceSummary({ balances, showDetails = false }: CompactBalanceSummaryProps) {
  const { hsa, wsa, total } = balances;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-muted/20 border border-border/30 rounded-lg p-3 mb-4 ${
        showDetails ? 'cursor-pointer hover:bg-muted/30 transition-colors duration-200' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <Wallet className="h-3 w-3 text-primary" />
          </div>
          <h3 className="font-medium text-xs text-foreground uppercase tracking-wide">Account Balances</h3>
        </div>
        {showDetails && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>View Details</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {/* HSA Balance */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">HSA</span>
          </div>
          <p className="text-sm font-bold text-foreground">${hsa.toFixed(0)}</p>
        </div>

        {/* WSA Balance */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">WSA</span>
          </div>
          <p className="text-sm font-bold text-foreground">${wsa.toFixed(0)}</p>
        </div>

        {/* Total Available */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Total</span>
          </div>
          <p className="text-sm font-bold text-primary">${total.toFixed(0)}</p>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="mt-2 pt-2 border-t border-border/20">
        <p className="text-xs text-muted-foreground text-center">
          Available for healthcare expenses
        </p>
      </div>
    </motion.div>
  );

  // Conditionally wrap with Link for navigation
  if (showDetails) {
    return (
      <Link href="/balances" className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
