import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, createUIMessageStream, JsonToSseTransformStream, streamText, tool } from "ai";
import type { NextRequest } from "next/server";

import { SYSTEM_PROMPT } from "@/lib/prompts";
import { mockPatientDataset } from "@twinn/store";
import { z } from "zod";


const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

// Define tools for each data type with proper typing


 const tools = {
  getBalances: tool({
    description:
      "Get patient's healthcare insurance balances, coverage amounts, and financial information. Use this when patients ask about balances, coverage, insurance money, how much is covered, remaining benefits, or financial information.",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("🔵 Tool getBalances called");
      return {
        balances: mockPatientDataset.balances,
        totalCount: mockPatientDataset.balances.length,
      };
    },
  }),

  getClinics: tool({
    description:
      "Get healthcare clinic locations, addresses, and facility information. Use this when patients ask about clinics, locations, addresses, facilities, medical centers, or where is the clinic.",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("🟢 Tool getClinics called");
      return {
        clinics: mockPatientDataset.clinics,
        totalCount: mockPatientDataset.clinics.length,
      };
    },
  }),

  getServices: tool({
    description:
      "Get available healthcare treatments, procedures, and medical services. Use this when patients ask about services, treatments, procedures, medical services, or what can I get.",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("🟡 Tool getServices called");
      return {
        services: mockPatientDataset.services,
        totalCount: mockPatientDataset.services.length,
      };
    },
  }),

  getSpecialists: tool({
    description:
      "Get healthcare specialist doctors, physicians, and medical professionals. Use this when patients ask about specialists, doctors, physicians, medical professionals, who can help me, or find a doctor.",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("🟠 Tool getSpecialists called");
      return {
        specialists: mockPatientDataset.specialists,
        totalCount: mockPatientDataset.specialists.length,
      };
    },
  }),

  getAvailability: tool({
    description:
      "Get available appointment times, scheduling slots, and booking availability. Use this when patients ask about appointments, availability, booking, schedule, or book an appointment.",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("🟣 Tool getAvailability called");
      return {
        availability: mockPatientDataset.availability.slice(0, 24),
        totalCount: mockPatientDataset.availability.length,
      };
    },
  }),

  getCurrentPath: tool({
    description: "Get the current page path for context",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("⚪ Tool getCurrentPath called");
      return {
        currentPath: "/dashboard",
      };
    },
  }),

  bookAppointment: tool({
    description: "Book an appointment with a specialist at a specific clinic. Use this when patients want to schedule, book, or reserve an appointment.",
    inputSchema: z.object({
      appointmentId: z.string().optional(),
      specialistId: z.string().optional(),
      clinicId: z.string().optional(),
      date: z.string().optional(),
      time: z.string().optional(),
    }),
    execute: async ({ appointmentId, specialistId, clinicId, date, time }) => {
      console.log("🔴 Tool bookAppointment called");
      console.log("🔴 Booking params:", { appointmentId, specialistId, clinicId, date, time });
      
      // Simulate booking process
      const bookingId = `booking-${Date.now()}`;
      
      return {
        success: true,
        bookingId,
        message: "Appointment successfully booked!",
        appointment: {
          id: bookingId,
          specialistId: specialistId || "specialist-001",
          clinicId: clinicId || "clinic-001",
          date: date || "2024-01-15",
          time: time || "13:45",
          status: "confirmed"
        }
      };
    },
  }),
};


export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("AI provider is not configured", { status: 500 });
  }

  const { messages = [], currentPath } = await req.json();

  type IncomingMessage = {
    role?: string;
    content?: unknown;
    parts?: Array<{ type?: string; text?: string }>;
  };

  const normalizedMessages: IncomingMessage[] = Array.isArray(messages)
    ? (messages as IncomingMessage[])
    : [];

  console.log("API Route - Received request:", { messages: normalizedMessages.length, currentPath });
  console.log("API Route - Original messages:", JSON.stringify(normalizedMessages, null, 2));

  // Debug: Show the last user message
  const lastUserMessage = normalizedMessages.filter((msg) => msg.role === "user").pop();
  const userText =
    typeof lastUserMessage?.content === "string"
      ? lastUserMessage.content
      : lastUserMessage?.parts?.find((part) => part.type === "text")?.text;
  console.log("API Route - Last user message:", userText);
  
  // Debug: Show which tool should be selected based on keywords
  const userTextLower = userText?.toLowerCase() || "";
  
        // Check for follow-up questions that shouldn't trigger tools
        const isFollowUpQuestion = /explain|what does this mean|how does this work|what should i do next|tell me more|elaborate|clarify|what is this|help me understand/i.test(userTextLower);

        if (isFollowUpQuestion) {
          console.log("🎯 Expected response: conversational follow-up (NO TOOLS)");
          console.log("🎯 This is a follow-up question - AI should explain without calling tools");
        } else if (userTextLower.includes("balance") || userTextLower.includes("coverage") || userTextLower.includes("insurance")) {
          console.log("🎯 Expected tool: getBalances (🔵)");
        } else if (userTextLower.includes("clinic") || userTextLower.includes("location") || userTextLower.includes("where")) {
          console.log("🎯 Expected tool: getClinics (🟢)");
        } else if (userTextLower.includes("service") || userTextLower.includes("treatment") || userTextLower.includes("procedure")) {
          console.log("🎯 Expected tool: getServices (🟡)");
        } else if (userTextLower.includes("specialist") || userTextLower.includes("doctor") || userTextLower.includes("physician") || userTextLower.includes("accupuncturist") || userTextLower.includes("acupuncturist") || userTextLower.includes("massage") || userTextLower.includes("chiropractor")) {
          console.log("🎯 Expected tools: getSpecialists (🟠) + getClinics (🟢) - being proactive!");
        } else if (userTextLower.includes("book") || userTextLower.includes("schedule") || userTextLower.includes("reserve")) {
          console.log("🎯 Expected tool: bookAppointment (🔴)");
        } else if (userTextLower.includes("appointment") || userTextLower.includes("availability") || userTextLower.includes("booking")) {
          console.log("🎯 Expected tool: getAvailability (🟣)");
        } else {
          console.log("🎯 No clear tool match found for:", userText);
          console.log("🎯 This should be a conversational response without tools");
        }

  const systemPrompt = SYSTEM_PROMPT;

  console.log("API Route - Starting streamText with OpenAI and tools");
  console.log("API Route - Model:", DEFAULT_MODEL);
  console.log("API Route - Available tools:", Object.keys(tools));
  
  try {
        // Convert messages to UIMessage format first, then to model messages
        // This automatically includes tool results in the conversation context
        const uiMessages = normalizedMessages.map((msg, index) => {
          // Ensure we only have valid roles
          let role = msg.role;
          if (role !== "user" && role !== "assistant") {
            role = "user"; // Default to user if role is invalid
          }

          // Handle both content and parts properly
          let parts: Array<{ type: string; text?: string; [key: string]: unknown }> = [];
          
          if (msg.parts && Array.isArray(msg.parts)) {
            // Use the parts directly if they exist - this includes tool calls
            parts = msg.parts as Array<{ type: string; text?: string; [key: string]: unknown }>;
          } else if (typeof msg.content === "string") {
            // Convert string content to text part
            parts = [{ type: "text", text: msg.content }];
          } else if (msg.content) {
            // Convert other content to text part
            parts = [{ type: "text", text: JSON.stringify(msg.content) }];
          }

          return {
            id: (msg as { id?: string }).id || `msg-${Date.now()}-${index}`,
            role: role as "user" | "assistant",
            parts: parts,
          };
        });

        const modelMessages = convertToModelMessages(uiMessages as Parameters<typeof convertToModelMessages>[0]);
        
        // Add system prompt as the first message
        modelMessages.unshift({ role: "system" as const, content: systemPrompt });
    
        console.log("API Route - Original normalized messages:", JSON.stringify(normalizedMessages, null, 2));
        console.log("API Route - UI Messages before conversion:", JSON.stringify(uiMessages, null, 2));
        console.log("API Route - Model messages after conversion:", JSON.stringify(modelMessages, null, 2));
    
    // Use createUIMessageStream for better tool handling
    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: openai(DEFAULT_MODEL),
          system: systemPrompt,
          messages: modelMessages,
          tools: tools,
          temperature: 0.7,
          experimental_activeTools: [
            "getBalances",
            "getClinics", 
            "getServices",
            "getSpecialists",
            "getAvailability",
            "getCurrentPath",
            "bookAppointment"
          ],
          onFinish: async (result) => {
            console.log("API Route - AI finished with:", {
              text: result.text,
              textLength: result.text?.length || 0,
              toolCalls: result.toolCalls?.map(tc => ({ name: tc.toolName })),
              toolCallsCount: result.toolCalls?.length || 0,
              finishReason: result.finishReason
            });
            
            if (!result.text || result.text.length === 0) {
              console.warn("⚠️ AI generated NO conversational text - only tool calls!");
              console.warn("⚠️ This might be due to model configuration or prompt issues");
            }
          },
          onError: (error) => {
            console.error("API Route - streamText error:", JSON.stringify(error, null, 2));
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: false,
          })
        );
      },
      generateId: () => Math.random().toString(36).substring(2, 15),
    });

    console.log("API Route - streamText completed successfully");

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error: unknown) {
    console.error("API Route - streamText error:", error);
    const maybeError = error as {
      data?: { requestBodyValues?: unknown };
      message?: string;
      responseBody?: unknown;
      cause?: unknown;
    };
    if (maybeError.data) {
      console.error("API Route - Error data:", maybeError.data);
    }
    if (maybeError.message) {
      console.error("API Route - Error message:", maybeError.message);
    }
    try {
      console.error("API Route - Full error object:", JSON.stringify(error, null, 2));
    } catch {
      console.error("API Route - Failed to stringify error");
    }
    if (maybeError.data?.requestBodyValues) {
      console.error(
        "API Route - Request body that caused error:",
        JSON.stringify(maybeError.data.requestBodyValues, null, 2),
      );
    }
    if (maybeError.responseBody) {
      console.error("API Route - Response body:", maybeError.responseBody);
    }
    if (maybeError.cause) {
      console.error("API Route - Error cause:", maybeError.cause);
    }
    return new Response("Internal server error", { status: 500 });
  }
}
