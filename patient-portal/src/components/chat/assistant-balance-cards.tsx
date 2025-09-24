"use client";

import type { HealthcareBalance } from "@twinn/store";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Info, Sparkles } from "lucide-react";

const statusStyles: Record<HealthcareBalance["status"], string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200",
  expiring: "bg-amber-100 text-amber-700 dark:bg-amber-900/70 dark:text-amber-200",
  expired: "bg-rose-100 text-rose-700 dark:bg-rose-900/70 dark:text-rose-200",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });

interface AssistantBalanceCardsProps {
  balances: HealthcareBalance[];
}

export function AssistantBalanceCards({ balances }: AssistantBalanceCardsProps) {
  if (!balances.length) return null;

  return (
    <div className="space-y-4">
      {balances.map((balance) => {
        const latestUsage = balance.usageHistory?.[0];

        return (
          <div
            key={balance.id}
            className="rounded-2xl border border-border/60 bg-muted/40 p-4 shadow-sm backdrop-blur-sm"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{balance.name}</h3>
                    <Badge className={`text-[11px] font-medium px-2 py-0.5 ${statusStyles[balance.status]}`}>
                      {balance.status === "active" && "Active"}
                      {balance.status === "expiring" && "Expiring Soon"}
                      {balance.status === "expired" && "Expired"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-md">
                    {balance.description}
                  </p>
                </div>
                <div className="rounded-xl bg-background/70 px-3 py-2 text-right">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Available</p>
                  <p className="text-lg font-semibold text-primary">{formatCurrency(balance.amount)}</p>
                </div>
              </div>

              <div className="grid gap-2 rounded-xl border border-dashed border-border/60 bg-background/60 px-3 py-2 text-xs md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Max per session</p>
                    <p className="text-muted-foreground">{formatCurrency(balance.coverage.maxPerSession)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Annual limit</p>
                    <p className="text-muted-foreground">{formatCurrency(balance.coverage.maxPerYear)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Copay</p>
                    <p className="text-muted-foreground">{formatCurrency(balance.coverage.copay)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Expires {formatDate(balance.expiryDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Renews {formatDate(balance.renewalDate)}</span>
                </div>
              </div>

              {latestUsage && (
                <div className="rounded-xl bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Recent session</p>
                  <p>
                    {latestUsage.service} · {latestUsage.provider} · {formatCurrency(Math.abs(latestUsage.amount))}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
