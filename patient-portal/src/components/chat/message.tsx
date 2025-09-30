"use client";

import { cn, sanitizeText } from "@/lib/utils";
import type { UIMessage } from "ai";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import { MessageContent } from "./elements/message";
import { Response } from "./elements/response";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "./elements/tool";
import { MessageActions } from "./message-actions";

const PureMessage = ({
  message,
  isLoading,
  isReadonly,
}: {
  message: UIMessage;
  isLoading: boolean;
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const isUser = message.role === "user";

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group/message w-full"
      data-role={message.role}
      initial={{ opacity: 0 }}
    >
      <div
        className={cn("flex w-full items-start gap-2 md:gap-3", {
          "justify-end": isUser && mode !== "edit",
          "justify-start": !isUser,
        })}
      >
        <div
          className={cn("flex flex-col", {
            "gap-2 md:gap-4": message.parts?.some(
              (p) => p.type === "text" && p.text?.trim()
            ),
            "w-full": !isUser || mode === "edit",
            "max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]":
              isUser && mode !== "edit",
          })}
        >
          {message.parts?.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;

            if (type === "text") {
              if (mode === "view") {
                return (
                  <div key={key}>
                    <MessageContent
                      className={cn({
                        "w-fit break-words rounded-2xl px-3 py-2 text-right text-white":
                          isUser,
                        "bg-transparent px-4 py-3 text-left": !isUser,
                      })}
                      style={
                        isUser
                          ? { backgroundColor: "#006cff" }
                          : undefined
                      }
                    >
                      <Response>{sanitizeText(part.text)}</Response>
                    </MessageContent>
                  </div>
                );
              }

              if (mode === "edit") {
                return (
                  <div
                    className="flex w-full flex-row items-start gap-3"
                    key={key}
                  >
                    <div className="flex-1">
                      <textarea
                        className="w-full resize-none rounded-md border p-2"
                        defaultValue={part.text}
                        rows={Math.max(2, part.text?.split("\n").length || 1)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-sm"
                        onClick={() => setMode("view")}
                      >
                        Save
                      </button>
                      <button
                        className="rounded-md border px-3 py-1 text-sm"
                        onClick={() => setMode("view")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              }
            }

            if (type?.startsWith("tool-")) {
              const toolName = type.replace("tool-", "");
              const toolPart = part as {
                state?: string;
                input?: unknown;
                output?: unknown;
                errorText?: string;
              };

              // Convert technical tool names to user-friendly names
              const getToolDisplayName = (name: string) => {
                const toolNames: Record<string, string> = {
                  getBalances: "Healthcare Benefits",
                  getClinics: "Clinic Locations", 
                  getServices: "Available Services",
                  getSpecialists: "Specialists",
                  getAvailability: "Appointment Times",
                  bookAppointment: "Booking Appointment",
                  getCurrentPath: "Current Page"
                };
                return toolNames[name] || name;
              };

              return (
                <Tool key={key} defaultOpen={true}>
                  <ToolHeader
                    type={`tool-${toolName}` as const}
                    state={(toolPart.state as "input-streaming" | "input-available" | "output-available" | "output-error") || "output-available"}
                  />
                  <ToolContent>
                    {toolPart.errorText && toolPart.input ? (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <ToolInput input={toolPart.input as any} />
                    ) : null}
                    <ToolOutput
                      output={
                        toolPart.output ? (
                          <ToolResultRenderer
                            toolName={toolName}
                            output={toolPart.output}
                          />
                        ) : null
                      }
                      errorText={toolPart.errorText}
                    />
                  </ToolContent>
                </Tool>
              );
            }

            return null;
          })}

          {!isReadonly && (
            <MessageActions
              message={message}
              mode={mode}
              setMode={setMode}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Component to render tool results in a user-friendly way
function ToolResultRenderer({ toolName, output }: { toolName: string; output: unknown }) {
  switch (toolName) {
    case "findCareRecommendations": {
      const data = output as {
        assistantSummary?: string;
        assistantHighlights?: string[];
        assistantNextSteps?: string;
        optionSummaries?: Array<{
          id: string;
          summary: string;
          budgetFit: string;
          estimatedOutOfPocket?: string;
          availability?: string;
          coverage?: string;
        }>;
        recommendations?: Array<{
          specialist: { id: string; name: string; specialty: string };
          clinic?: { name?: string; address?: string; city?: string };
          pricing: { formattedEstimatedOutOfPocket?: string };
          availability?: { start: string };
          coverage?: { balanceType: string; expiryDate?: string };
        }>;
      };

      return (
        <div className="space-y-3">
          {data.assistantSummary && (
            <div className="font-medium text-sm">{data.assistantSummary}</div>
          )}
          {data.assistantHighlights && data.assistantHighlights.length > 0 && (
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
              {data.assistantHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          )}
          {data.optionSummaries && data.optionSummaries.length > 0 && (
            <div className="space-y-2">
              {data.optionSummaries.slice(0, 3).map((option) => (
                <div key={option.id} className="rounded-lg border bg-background p-3">
                  <div className="font-medium text-sm">{option.summary}</div>
                  <div className="text-xs text-muted-foreground space-y-1 mt-1">
                    <div>{option.budgetFit}</div>
                    {option.estimatedOutOfPocket && (
                      <div>Out-of-pocket: {option.estimatedOutOfPocket}</div>
                    )}
                    {option.availability && <div>Next slot: {option.availability}</div>}
                    {option.coverage && <div>Coverage: {option.coverage}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.assistantNextSteps && (
            <div className="rounded-md bg-muted/50 p-2 text-xs">
              Next step: {data.assistantNextSteps}
            </div>
          )}
        </div>
      );
    }

    case "getBalanceDetails": {
      const data = output as {
        assistantSummary?: string;
        assistantHighlights?: string[];
        assistantNextSteps?: string;
        matchSummaries?: Array<{
          id: string;
          name: string;
          remaining?: string;
          expiry?: string;
          alerts?: string[];
          status?: string;
        }>;
      };

      return (
        <div className="space-y-3">
          {data.assistantSummary && (
            <div className="font-medium text-sm">{data.assistantSummary}</div>
          )}
          {data.assistantHighlights && data.assistantHighlights.length > 0 && (
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
              {data.assistantHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          )}
          {data.matchSummaries && data.matchSummaries.length > 0 && (
            <div className="space-y-2">
              {data.matchSummaries.slice(0, 3).map((match) => (
                <div key={match.id} className="rounded-lg border bg-background p-3">
                  <div className="font-medium text-sm">{match.name}</div>
                  <div className="text-xs text-muted-foreground space-y-1 mt-1">
                    {match.remaining && <div>Remaining: {match.remaining}</div>}
                    {match.expiry && <div>Expiry: {match.expiry}</div>}
                    {match.status && <div>Status: {match.status}</div>}
                    {match.alerts && match.alerts.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1">
                        {match.alerts.map((alert, idx) => (
                          <li key={idx}>{alert}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.assistantNextSteps && (
            <div className="rounded-md bg-muted/50 p-2 text-xs">
              Next step: {data.assistantNextSteps}
            </div>
          )}
        </div>
      );
    }

    case "getBalances":
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Healthcare Balances ({(output as { totalCount?: number }).totalCount || 0})
          </div>
          {(output as { assistantSummary?: string }).assistantSummary && (
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              {(output as { assistantSummary: string }).assistantSummary}
            </div>
          )}
          {(output as { assistantHighlights?: string[] }).assistantHighlights &&
            (output as { assistantHighlights: string[] }).assistantHighlights.length > 0 && (
              <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                {(output as { assistantHighlights: string[] }).assistantHighlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          <div className="grid gap-2">
            {(output as { balances?: Array<{ id: string; name: string; remainingAmount: number; totalUsed: number; description: string; expiryDate: string; renewalDate: string; status: string }> }).balances && (output as { balances: Array<{ id: string; name: string; remainingAmount: number; totalUsed: number; description: string; expiryDate: string; renewalDate: string; status: string }> }).balances.length > 0 ? (
              (output as { balances: Array<{ id: string; name: string; remainingAmount: number; totalUsed: number; description: string; expiryDate: string; renewalDate: string; status: string }> }).balances.slice(0, 5).map((balance) => {
                const formatDateDisplay = (iso?: string) => {
                  if (!iso) return undefined;
                  const date = new Date(iso);
                  if (isNaN(date.getTime())) return undefined;
                  return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                };

                const calculateDaysUntil = (isoDate: string) => {
                  const target = new Date(isoDate);
                  if (isNaN(target.getTime())) return undefined;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  target.setHours(0, 0, 0, 0);
                  const diffMs = target.getTime() - today.getTime();
                  return Math.round(diffMs / 86_400_000);
                };

                const daysUntilExpiry = calculateDaysUntil(balance.expiryDate);
                const isExpired = daysUntilExpiry !== undefined && daysUntilExpiry < 0;
                const isExpiringSoon = daysUntilExpiry !== undefined && daysUntilExpiry >= 0 && daysUntilExpiry <= 45;

                return (
                  <div key={balance.id} className="rounded-lg border p-3 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{balance.name}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        isExpired ? 'bg-red-100 text-red-800' :
                        isExpiringSoon ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {isExpired ? 'Expired' : 
                         isExpiringSoon ? 'Expiring Soon' : 
                         'Active'}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${balance.remainingAmount} remaining
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {balance.description}
                    </div>
                    {balance.totalUsed > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Used: ${balance.totalUsed}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Expires: {formatDateDisplay(balance.expiryDate) || 'No expiry date'}
                      {daysUntilExpiry !== undefined && !isExpired && (
                        <span className="ml-2">
                          ({daysUntilExpiry === 0 ? 'Today' : 
                            daysUntilExpiry === 1 ? 'Tomorrow' : 
                            `${daysUntilExpiry} days`})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground">No balances found</div>
            )}
          </div>
        </div>
      );

    case "getClinics":
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Clinics ({(output as { totalCount?: number }).totalCount || 0})
          </div>
          <div className="grid gap-2">
            {(output as { clinics?: Array<{ id: string; name: string; address: string; specialties?: string[] }> }).clinics && (output as { clinics: Array<{ id: string; name: string; address: string; specialties?: string[] }> }).clinics.length > 0 ? (
              (output as { clinics: Array<{ id: string; name: string; address: string; specialties?: string[] }> }).clinics.slice(0, 5).map((clinic) => (
                <div key={clinic.id} className="rounded-lg border p-3 bg-background">
                  <div className="font-medium">{clinic.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {clinic.address}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {clinic.specialties?.join(", ")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No clinics found</div>
            )}
          </div>
        </div>
      );

    case "getServices":
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Services ({(output as { totalCount?: number }).totalCount || 0})
          </div>
          <div className="grid gap-2">
            {(output as { services?: Array<{ id: string; name: string; category: string; description: string }> }).services && (output as { services: Array<{ id: string; name: string; category: string; description: string }> }).services.length > 0 ? (
              (output as { services: Array<{ id: string; name: string; category: string; description: string }> }).services.slice(0, 5).map((service) => (
                <div key={service.id} className="rounded-lg border p-3 bg-background">
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {service.category}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {service.description}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No services found</div>
            )}
          </div>
        </div>
      );

    case "getSpecialists":
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Specialists ({(output as { totalCount?: number }).totalCount || 0})
          </div>
          <div className="grid gap-2">
            {(output as { specialists?: Array<{ id: string; name: string; specialty: string; clinic: string }> }).specialists && (output as { specialists: Array<{ id: string; name: string; specialty: string; clinic: string }> }).specialists.length > 0 ? (
              (output as { specialists: Array<{ id: string; name: string; specialty: string; clinic: string }> }).specialists.slice(0, 5).map((specialist) => (
                <div key={specialist.id} className="rounded-lg border p-3 bg-background">
                  <div className="font-medium">{specialist.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {specialist.specialty}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {specialist.clinic}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No specialists found</div>
            )}
          </div>
        </div>
      );

    case "getAvailability":
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Available Appointments ({(output as { totalCount?: number }).totalCount || 0})
          </div>
          <div className="grid gap-2">
            {(output as { availability?: Array<{ id: string; start: string; end: string; mode: string }> }).availability && (output as { availability: Array<{ id: string; start: string; end: string; mode: string }> }).availability.length > 0 ? (
              (output as { availability: Array<{ id: string; start: string; end: string; mode: string }> }).availability.slice(0, 5).map((slot, index) => {
                const startDate = new Date(slot.start);
                const endDate = new Date(slot.end);
                const dateStr = startDate.toLocaleDateString();
                const timeStr = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                
                return (
                  <div key={slot.id || index} className="rounded-lg border p-3 bg-background">
                    <div className="font-medium">{dateStr}</div>
                    <div className="text-sm text-muted-foreground">
                      {timeStr}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {slot.mode === 'telehealth' ? '📱 Telehealth' : '🏥 In-person'}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground">No available appointments found</div>
            )}
          </div>
        </div>
      );

    case "bookAppointment":
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Booking Result
          </div>
          <div className="rounded-lg border p-3 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-green-600">✅</div>
              <div className="font-medium text-green-800">
                {(output as { success?: boolean }).success ? "Appointment Booked Successfully!" : "Booking Failed"}
              </div>
            </div>
            {(output as { appointment?: { id: string; date: string; time: string; status: string } }).appointment && (
              <div className="text-sm text-green-700">
                <div>Booking ID: {(output as { appointment: { id: string; date: string; time: string; status: string } }).appointment.id}</div>
                <div>Date: {(output as { appointment: { id: string; date: string; time: string; status: string } }).appointment.date}</div>
                <div>Time: {(output as { appointment: { id: string; date: string; time: string; status: string } }).appointment.time}</div>
                <div>Status: {(output as { appointment: { id: string; date: string; time: string; status: string } }).appointment.status}</div>
              </div>
            )}
            {(output as { message?: string }).message && (
              <div className="text-sm text-green-600 mt-2">
                {(output as { message: string }).message}
              </div>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="rounded-lg border p-3 bg-background">
          <div className="text-xs text-muted-foreground">Tool Result</div>
          <div className="text-sm">
            {JSON.stringify(output, null, 2)}
          </div>
        </div>
      );
  }
}

export const Message = memo(PureMessage);
