import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, createUIMessageStream, JsonToSseTransformStream, streamText, tool } from "ai";
import type { NextRequest } from "next/server";

import { SYSTEM_PROMPT } from "@/lib/prompts";
import type {
  Clinic,
  HealthcareBalance,
  Service,
  ServiceOption,
  SpecialistSummary,
} from "@twinn/store";
import { mockPatientDataset } from "@twinn/store";
import { stepCountIs } from "ai";
import { z } from "zod";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const serviceOptionById = new Map<string, ServiceOption>(
  (mockPatientDataset.serviceOptions ?? []).map((option) => [option.id, option]),
);

const serviceById = new Map<string, Service>(
  (mockPatientDataset.services ?? []).map((service) => [service.id, service]),
);

const clinicById = new Map<string, Clinic>(
  (mockPatientDataset.clinics ?? []).map((clinic) => [clinic.id, clinic]),
);

const balanceByType = new Map<HealthcareBalance["type"], HealthcareBalance>(
  (mockPatientDataset.balances ?? []).map((balance) => [balance.type, balance]),
);

const SPECIALTY_TO_BALANCE_TYPE: Record<string, HealthcareBalance["type"]> = {
  "Massage Therapy": "massage-therapist",
  "Chiropractic Care": "chiropractor",
  Physiotherapy: "physiotherapist",
  "Psychology & Social Work": "psychologist",
  Acupuncture: "acupuncturist",
  "Dietician Services": "dietician",
  "Audiologist Services": "audiologist",
  "Occupational Therapy": "occupational-therapist",
  Osteopathy: "osteopath",
  Podiatry: "podiatrist",
  "Speech Therapy": "speech-therapist",
  Naturopathy: "naturopath",
};

const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  "Massage Therapy": [
    "massage",
    "tension",
    "stress",
    "muscle",
    "relax",
    "soft tissue",
  ],
  "Chiropractic Care": [
    "back pain",
    "spine",
    "alignment",
    "chiropractor",
    "adjustment",
    "sciatica",
  ],
  Physiotherapy: [
    "rehab",
    "physio",
    "injury",
    "mobility",
    "pain",
    "exercise",
  ],
  "Psychology & Social Work": [
    "mental",
    "anxiety",
    "therapy",
    "counseling",
    "depression",
  ],
  Acupuncture: [
    "acupuncture",
    "meridian",
    "needles",
    "chi",
    "traditional chinese",
  ],
  "Dietician Services": [
    "diet",
    "nutrition",
    "meal",
    "food",
    "weight",
  ],
  "Audiologist Services": [
    "hearing",
    "audiology",
    "tinnitus",
    "ear",
  ],
  "Occupational Therapy": [
    "occupational",
    "daily living",
    "adapt",
    "rehabilitation",
  ],
  Osteopathy: [
    "osteopath",
    "manual therapy",
    "holistic",
    "alignment",
  ],
  Podiatry: [
    "foot",
    "ankle",
    "podiatrist",
    "chiropodist",
  ],
  "Speech Therapy": [
    "speech",
    "communication",
    "language",
    "swallow",
  ],
  Naturopathy: [
    "natural",
    "holistic",
    "naturopath",
    "supplement",
  ],
};

const BALANCE_KEYWORDS: Record<HealthcareBalance["type"], string[]> = {
  "massage-therapist": ["massage", "massage therapist", "soft tissue"],
  chiropractor: ["chiro", "chiropractic", "back", "spine"],
  psychologist: ["mental", "therapy", "counsel", "psych"],
  physiotherapist: ["physio", "rehab", "mobility", "injury"],
  acupuncturist: ["acupuncture", "needles", "meridian"],
  dietician: ["diet", "nutrition", "meal", "dietician", "nutritionist"],
  audiologist: ["hearing", "audiology", "ear"],
  "occupational-therapist": ["occupational", "daily living", "ot"],
  osteopath: ["osteopath", "manual", "alignment"],
  podiatrist: ["podiatry", "foot", "chiropody", "ankle"],
  "speech-therapist": ["speech", "language", "communication"],
  naturopath: ["naturopath", "natural", "holistic"],
  other: ["other", "misc", "general"],
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(Number(value.toFixed(2)));

const getCityFromAddress = (address?: string) => {
  if (!address) {
    return "";
  }

  const parts = address.split(",");
  return parts.length >= 2 ? parts[1]?.trim().toLowerCase() ?? "" : "";
};

const knownCities = Array.from(
  new Set((mockPatientDataset.clinics ?? []).map((clinic) => getCityFromAddress(clinic.address)).filter(Boolean)),
);

const moneyRegex = /(?:\$\s*)?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)(?:\s*(?:cad|usd|dollars?|bucks?))?/i;

const parseBudgetFromQuery = (text: string): number | undefined => {
  const match = text.match(moneyRegex);
  if (!match) {
    return undefined;
  }

  const numeric = match[1]?.replace(/[\s,]/g, "");
  const value = numeric ? Number.parseFloat(numeric) : Number.NaN;
  return Number.isFinite(value) ? value : undefined;
};

const computeCoverageCost = (option: ServiceOption, balance?: HealthcareBalance) => {
  const listPrice = option.price;

  if (!balance) {
    return {
      listPrice,
      insurancePays: 0,
      estimatedOutOfPocket: listPrice,
      coverageApplied: false,
      coverageName: undefined as string | undefined,
      balanceStatus: undefined as HealthcareBalance["status"] | undefined,
      remainingAllowance: undefined as number | undefined,
      allowanceMaxPerSession: undefined as number | undefined,
      allowanceCopay: undefined as number | undefined,
    };
  }

  const coveredPortion = Math.min(balance.coverage.maxPerSession, listPrice);
  const difference = Math.max(listPrice - coveredPortion, 0);
  const insurancePays = Number(coveredPortion.toFixed(2));
  const estimatedOutOfPocket = Number((difference + balance.coverage.copay).toFixed(2));
  const yearlyAllowance = balance.coverage.maxPerYear;
  const used = balance.usageHistory.reduce((total, entry) => {
    const amount = entry.amount;
    return amount < 0 ? total + Math.abs(amount) : total;
  }, 0);
  const remainingAllowance = Number(Math.max(yearlyAllowance - used, 0).toFixed(2));

  return {
    listPrice,
    insurancePays,
    estimatedOutOfPocket,
    coverageApplied: true,
    coverageName: balance.name,
    balanceStatus: balance.status,
    remainingAllowance,
    allowanceMaxPerSession: balance.coverage.maxPerSession,
    allowanceCopay: balance.coverage.copay,
    coverageExpiresOn: balance.expiryDate,
  };
};

const getEarliestAvailability = (
  specialistId: string,
  serviceOptionId: string,
  clinicId?: string,
) => {
  const slots = (mockPatientDataset.availability ?? []).filter((slot) => {
    if (slot.specialistId !== specialistId || slot.serviceOptionId !== serviceOptionId) {
      return false;
    }
    if (clinicId && slot.clinicId !== clinicId) {
      return false;
    }
    return true;
  });

  if (slots.length === 0) {
    return undefined;
  }

  const ordered = slots.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  const nextSlot = ordered[0];

  return {
    slotId: nextSlot.id,
    start: nextSlot.start,
    end: nextSlot.end,
    mode: nextSlot.mode,
    clinicId: nextSlot.clinicId,
  };
};

const buildSpecialistProfile = (
  specialist: SpecialistSummary,
  serviceOptionId: string,
) => {
  const option = serviceOptionById.get(serviceOptionId);
  if (!option) {
    return undefined;
  }

  const service = serviceById.get(option.serviceId);
  const clinicId = service?.clinicId ?? specialist.clinicIds[0];
  const clinic = clinicId ? clinicById.get(clinicId) : undefined;
  const specialtyKey = specialist.specialty;
  const balanceType = SPECIALTY_TO_BALANCE_TYPE[specialtyKey] ?? SPECIALTY_TO_BALANCE_TYPE[service?.name ?? ""];
  const balance = balanceType ? balanceByType.get(balanceType) : undefined;
  const pricing = computeCoverageCost(option, balance);
  const availability = getEarliestAvailability(specialist.userId, option.id, clinicId);

  return {
    specialist,
    clinic,
    service,
    option,
    balance,
    pricing,
    availability,
  };
};

const calculateDaysUntil = (isoDate: string) => {
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) {
    return undefined;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / 86_400_000);
};

const getMostRecentUsage = (balance: HealthcareBalance) => {
  if (!balance.usageHistory || balance.usageHistory.length === 0) {
    return undefined;
  }

  const ordered = [...balance.usageHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return ordered[0];
};

const formatDateDisplay = (iso?: string) => {
  if (!iso) {
    return undefined;
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatAvailabilityWindow = (
  availability?: {
    start: string;
    end: string;
    mode: string;
  },
) => {
  if (!availability) {
    return undefined;
  }

  const start = new Date(availability.start);
  if (Number.isNaN(start.getTime())) {
    return undefined;
  }

  const end = new Date(availability.end);

  const dateLabel = start.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });

  const startTime = start.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = Number.isNaN(end.getTime())
    ? undefined
    : end.toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
      });

  const modeLabel = availability.mode === "telehealth" ? "telehealth" : "in-person";

  return endTime
    ? `${dateLabel} · ${startTime} – ${endTime} (${modeLabel})`
    : `${dateLabel} · ${startTime} (${modeLabel})`;
};

// Define tools for each data type with proper typing

const tools = {
  weather: tool({
    description: 'Get the weather in a location',
    inputSchema: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }) => ({
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    }),
  }),
  findCareRecommendations: tool({
    description:
      "Analyze patient requests for symptoms, pain, budget, or location and return detailed specialist recommendations with pricing, out-of-pocket estimates, coverage, and availability information.",
    inputSchema: z.object({
      query: z.string().describe("Natural language description of what the patient needs."),
      maxOutOfPocket: z
        .number()
        .nonnegative()
        .optional()
        .describe("Maximum amount the patient wants to pay out of pocket for a visit."),
      preferredCity: z
        .string()
        .optional()
        .describe("City or region the patient would like to visit."),
    }),
    execute: async ({ query, maxOutOfPocket, preferredCity }) => {
      const normalizedQuery = query.trim();
      if (!normalizedQuery) {
        return {
          query,
          recommendations: [],
          totalMatches: 0,
          filtersApplied: {
            maxOutOfPocket,
            preferredCity,
            telehealthRequested: false,
          },
          note: "Query was empty after trimming whitespace.",
        };
      }

      const lowerQuery = normalizedQuery.toLowerCase();
      const budget = maxOutOfPocket ?? parseBudgetFromQuery(lowerQuery);
      let location = preferredCity?.trim().toLowerCase() ?? "";

      if (!location) {
        const detectedCity = knownCities.find((city) => city && lowerQuery.includes(city));
        if (detectedCity) {
          location = detectedCity;
        }
      }

      const wantsTelehealth = /telehealth|virtual visit|video visit|online session/.test(
        lowerQuery,
      );

      const candidates = (mockPatientDataset.specialists ?? [])
        .flatMap((specialist) =>
          specialist.serviceOptionIds
            .map((serviceOptionId) => buildSpecialistProfile(specialist, serviceOptionId))
            .filter((profile): profile is NonNullable<ReturnType<typeof buildSpecialistProfile>> =>
              Boolean(profile),
            ),
        )
        .map((profile) => {
          const { specialist, clinic, service, balance, pricing, option, availability } = profile;
          const specialtyKeywords = SPECIALTY_KEYWORDS[specialist.specialty] ?? [];
          const matchReasons: string[] = [];
          let score = 0;

          if (lowerQuery.includes(specialist.specialty.toLowerCase())) {
            score += 6;
            matchReasons.push(`Patient mentioned specialty "${specialist.specialty}" explicitly.`);
          }

          const serviceName = service?.name;
          if (serviceName && lowerQuery.includes(serviceName.toLowerCase())) {
            score += 4;
            matchReasons.push(`Patient mentioned service "${serviceName}".`);
          }

          const matchedKeywords = specialtyKeywords.filter((keyword) =>
            lowerQuery.includes(keyword),
          );
          if (matchedKeywords.length > 0) {
            score += matchedKeywords.length * 3;
            matchReasons.push(
              `Matched specialty keywords: ${matchedKeywords
                .map((kw) => `"${kw}"`)
                .join(", ")}.`,
            );
          }

          if (balance) {
            const balanceNameLower = balance.name.toLowerCase();
            if (lowerQuery.includes(balanceNameLower)) {
              score += 2;
              matchReasons.push(`Patient referenced benefit "${balance.name}".`);
            }

            if (lowerQuery.includes(balance.type.replace(/-/g, " "))) {
              score += 1;
              matchReasons.push(`Query mentioned balance type "${balance.type}".`);
            }
          }

          if (budget !== undefined) {
            if (pricing.estimatedOutOfPocket <= budget) {
              score += 8;
              matchReasons.push(
                `Estimated out-of-pocket ${formatCurrency(
                  pricing.estimatedOutOfPocket,
                )} fits within budget ${formatCurrency(budget)}.`,
              );
            } else {
              score -= 5;
              matchReasons.push(
                `Estimated out-of-pocket ${formatCurrency(
                  pricing.estimatedOutOfPocket,
                )} is above requested budget ${formatCurrency(budget)}.`,
              );
            }
          }

          const clinicCityLower = getCityFromAddress(clinic?.address);
          if (location) {
            if (clinicCityLower && clinicCityLower.includes(location)) {
              score += 5;
              matchReasons.push(
                `Clinic "${clinic?.name ?? ""}" is located in ${clinicCityLower}.`,
              );
            } else {
              score -= 1;
              matchReasons.push(
                `Clinic location ${clinicCityLower || "unknown"} does not match requested city ${location}.`,
              );
            }
          }

          if (wantsTelehealth) {
            if (specialist.telehealth) {
              score += 3;
              matchReasons.push("Specialist offers telehealth as requested.");
            } else {
              score -= 2;
              matchReasons.push("Specialist does not offer telehealth but patient asked for it.");
            }
          }

          if (specialist.rating) {
            score += specialist.rating * 0.4;
          }

          if (availability) {
            score += 1;
            matchReasons.push("Upcoming availability found.");
          }

          const withinBudget = budget !== undefined
            ? pricing.estimatedOutOfPocket <= budget
            : undefined;

          return {
            profile,
            score,
            withinBudget,
            matchReasons,
            clinicCityLower,
          };
        });

      const filtered = candidates.filter((candidate) => candidate.score > 0 || !budget);

      const sorted = filtered
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return (
            a.profile.pricing.estimatedOutOfPocket - b.profile.pricing.estimatedOutOfPocket
          );
        })
        .slice(0, 5);

      const recommendations = sorted.map(({ profile, score, withinBudget, matchReasons }) => {
        const { specialist, clinic, service, option, balance, pricing, availability } = profile;
        const clinicCity = clinic?.address?.split(",")[1]?.trim();
        const startsInHours = availability
          ? Math.round((new Date(availability.start).getTime() - Date.now()) / 36e5)
          : undefined;

        return {
          specialist: {
            id: specialist.userId,
            name: specialist.name,
            specialty: specialist.specialty,
            rating: specialist.rating,
            languages: specialist.languages,
            telehealth: specialist.telehealth,
            experience: specialist.experience,
            education: specialist.education,
            statedNextAvailability: specialist.nextAvailable,
          },
          clinic: clinic
            ? {
                id: clinic.id,
                name: clinic.name,
                address: clinic.address,
                city: clinicCity,
                phone: clinic.phone,
                timezone: clinic.timezone,
              }
            : undefined,
          service: service
            ? {
                id: service.id,
                name: service.name,
                durationMinutes: option.duration,
              }
            : undefined,
          pricing: {
            listPrice: pricing.listPrice,
            formattedListPrice: formatCurrency(pricing.listPrice),
            insurancePays: pricing.insurancePays,
            formattedInsurancePays: formatCurrency(pricing.insurancePays),
            estimatedOutOfPocket: pricing.estimatedOutOfPocket,
            formattedEstimatedOutOfPocket: formatCurrency(pricing.estimatedOutOfPocket),
            coverageApplied: pricing.coverageApplied,
            coverageName: pricing.coverageName,
            balanceStatus: pricing.balanceStatus,
            remainingAllowance: pricing.remainingAllowance,
            allowanceMaxPerSession: pricing.allowanceMaxPerSession,
            allowanceCopay: pricing.allowanceCopay,
            coverageExpiresOn: pricing.coverageExpiresOn,
          },
          availability: availability
            ? {
                slotId: availability.slotId,
                clinicId: availability.clinicId,
                start: availability.start,
                end: availability.end,
                mode: availability.mode,
                startsInHours,
              }
            : undefined,
          coverage: balance
            ? {
                balanceId: balance.id,
                balanceType: balance.type,
                expiryDate: balance.expiryDate,
                renewalDate: balance.renewalDate,
              }
            : undefined,
          match: {
            score: Number(score.toFixed(2)),
            withinBudget,
            reasons: matchReasons,
          },
        };
      });

      const topRecommendation = recommendations[0];

      const assistantSummary = topRecommendation
        ? `Top match: ${topRecommendation.specialist.name} (${topRecommendation.specialist.specialty}) at ${
            topRecommendation.clinic?.name ?? "a nearby clinic"
          }. Estimated out-of-pocket ${topRecommendation.pricing.formattedEstimatedOutOfPocket}.`
        : "No matching specialists found in the current dataset.";

      const assistantHighlights = topRecommendation
        ? [
            topRecommendation.match.withinBudget === false
              ? `Estimated out-of-pocket ${topRecommendation.pricing.formattedEstimatedOutOfPocket} exceeds the requested budget.`
              : `Estimated out-of-pocket ${topRecommendation.pricing.formattedEstimatedOutOfPocket} fits the requested budget.`,
            topRecommendation.coverage
              ? `Coverage: ${topRecommendation.coverage.balanceType.replace(/-/g, " ")} benefit${
                  topRecommendation.coverage.expiryDate
                    ? ` (expires ${formatDateDisplay(topRecommendation.coverage.expiryDate)})`
                    : ""
                }.`
              : "No specific balance coverage matched—patient may pay full cost.",
            topRecommendation.availability
              ? `Soonest slot: ${formatAvailabilityWindow(topRecommendation.availability)}`
              : "No real-time availability surfaced—consider checking alternate clinics.",
          ]
        : [
            "Ask if the patient is open to adjusting budget, location, or telehealth options to widen the search.",
          ];

      const assistantNextSteps = topRecommendation
        ? `Offer to secure ${topRecommendation.specialist.name}'s ${
            topRecommendation.availability
              ? formatAvailabilityWindow(topRecommendation.availability)
              : "next available"
          } slot or review additional options.`
        : "Offer to try a broader search, different specialty, or connect the patient with support for more help.";

      const optionSummaries = recommendations.map((rec) => {
        const availabilitySummary = formatAvailabilityWindow(rec.availability);
        const coverageSummary = rec.coverage
          ? `${rec.coverage.balanceType.replace(/-/g, " ")} · expires ${
              formatDateDisplay(rec.coverage.expiryDate) ?? "later"
            }`
          : "No linked coverage";

        return {
          id: rec.specialist.id,
          summary: `${rec.specialist.name} (${rec.specialist.specialty}) at ${rec.clinic?.name ?? "clinic"}`,
          budgetFit: rec.match.withinBudget === undefined
            ? "Budget not provided"
            : rec.match.withinBudget
              ? "Within budget"
              : "Above budget",
          estimatedOutOfPocket: rec.pricing.formattedEstimatedOutOfPocket,
          availability: availabilitySummary,
          coverage: coverageSummary,
        };
      });

      return {
        query,
        normalizedQuery: lowerQuery,
        totalMatches: recommendations.length,
        filtersApplied: {
          maxOutOfPocket: budget,
          preferredCity: location || undefined,
          telehealthRequested: wantsTelehealth,
        },
        assistantSummary,
        assistantHighlights,
        assistantNextSteps,
        optionSummaries,
        recommendations,
      };
    },
  }),

  getBalances: tool({
    description:
      "Get patient's healthcare insurance balances, coverage amounts, and financial information. Use this when patients ask about balances, coverage, insurance money, how much is covered, remaining benefits, or financial information.",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("🔵 Tool getBalances called");
      const balances = mockPatientDataset.balances ?? [];
      
      // Calculate actual remaining amounts for each balance
      const balancesWithRemaining = balances.map((balance) => {
        const totalUsed = balance.usageHistory.reduce((total, entry) => {
          const amount = entry.amount;
          return amount < 0 ? total + Math.abs(amount) : total;
        }, 0);
        const remainingAllowance = Number(Math.max(balance.coverage.maxPerYear - totalUsed, 0).toFixed(2));
        
        return {
          ...balance,
          remainingAmount: remainingAllowance,
          totalUsed: Number(totalUsed.toFixed(2))
        };
      });
      
      const totalRemaining = balancesWithRemaining.reduce((total, balance) => total + balance.remainingAmount, 0);
      const expiringSoon = balances
        .map((balance) => ({
          balance,
          daysUntilExpiry: calculateDaysUntil(balance.expiryDate),
        }))
        .filter(({ daysUntilExpiry }) => typeof daysUntilExpiry === "number" && daysUntilExpiry >= 0 && daysUntilExpiry <= 45);

      const assistantSummary = `You have ${balances.length} active benefits with ${formatCurrency(totalRemaining)} remaining overall.`;
      const assistantHighlights = [
        expiringSoon.length > 0
          ? `${expiringSoon.length} benefit${expiringSoon.length === 1 ? "" : "s"} expire within the next 45 days.`
          : "No benefits are close to expiring.",
        "Ask which benefit the patient wants to use so we can check coverage and availability.",
      ];

      return {
        balances: balancesWithRemaining,
        totalCount: balances.length,
        totalRemaining: formatCurrency(totalRemaining),
        assistantSummary,
        assistantHighlights,
      };
    },
  }),

  getBalanceDetails: tool({
    description:
      "Look up a specific healthcare balance to report expiry, renewal timeline, remaining allowance, and copay details. Use when a patient asks when a balance expires or how much is left for a benefit.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("Patient's question or the balance name/type they are referencing."),
      topK: z
        .number()
        .int()
        .positive()
        .max(5)
        .optional()
        .describe("Maximum number of top matches to return."),
    }),
    execute: async ({ query, topK }) => {
      const normalizedQuery = query.trim();
      if (!normalizedQuery) {
        return {
          query,
          matches: [],
          totalMatches: 0,
          note: "Query was empty after trimming whitespace.",
        };
      }

      const lowerQuery = normalizedQuery.toLowerCase();
      const tokens = lowerQuery.split(/[^a-z0-9]+/).filter(Boolean);
      const wantsExpiry = /expire|expiry|expiration|when/i.test(normalizedQuery);
      const wantsCopay = /copay|out of pocket|deductible/i.test(lowerQuery);

      const matches = (mockPatientDataset.balances ?? []).map((balance) => {
        const nameLower = balance.name.toLowerCase();
        const typeLower = balance.type.replace(/-/g, " ");
        const descriptionLower = balance.description.toLowerCase();
        const keywords = BALANCE_KEYWORDS[balance.type] ?? [];

        let score = 0;
        const reasons: string[] = [];

        if (lowerQuery.includes(nameLower)) {
          score += 6;
          reasons.push(`Patient referenced balance name "${balance.name}".`);
        }

        if (lowerQuery.includes(typeLower)) {
          score += 4;
          reasons.push(`Query mentioned balance type "${balance.type}".`);
        }

        const matchedKeywords = keywords.filter((keyword) => lowerQuery.includes(keyword));
        if (matchedKeywords.length > 0) {
          score += matchedKeywords.length * 2;
          reasons.push(
            `Matched balance keywords: ${matchedKeywords.map((kw) => `"${kw}"`).join(", ")}.`,
          );
        }

        tokens.forEach((token) => {
          if (nameLower.includes(token) || typeLower.includes(token) || descriptionLower.includes(token)) {
            score += 0.5;
          }
        });

        const balanceExpiryDays = calculateDaysUntil(balance.expiryDate);
        if (wantsExpiry) {
          score += 1;
          if (balanceExpiryDays !== undefined) {
            if (balanceExpiryDays < 0) {
              reasons.push("Balance already expired, which may be why the patient is asking.");
            } else if (balanceExpiryDays <= 60) {
              score += 1;
              reasons.push(`Balance expires in ${balanceExpiryDays} days.`);
            }
          }
        }

        if (wantsCopay && balance.coverage.copay > 0) {
          score += 0.5;
          reasons.push(`Balance has a copay of ${formatCurrency(balance.coverage.copay)}.`);
        }

        const totalUsed = balance.usageHistory.reduce((total, entry) => {
          const amount = entry.amount;
          return amount < 0 ? total + Math.abs(amount) : total;
        }, 0);

        const remainingAllowance = Number(
          Math.max(balance.coverage.maxPerYear - totalUsed, 0).toFixed(2),
        );
        const utilizationPercent = balance.coverage.maxPerYear
          ? Number(((totalUsed / balance.coverage.maxPerYear) * 100).toFixed(1))
          : 0;
        const daysUntilExpiry = balanceExpiryDays;
        const daysUntilRenewal = calculateDaysUntil(balance.renewalDate);
        const recentUsage = getMostRecentUsage(balance);

        const alerts: string[] = [];
        if (daysUntilExpiry !== undefined) {
          if (daysUntilExpiry < 0) {
            alerts.push("Balance expired. Consider renewal or alternative coverage.");
          } else if (daysUntilExpiry <= 45) {
            alerts.push(`Balance expires soon (in ${daysUntilExpiry} days).`);
          }
        }

        if (remainingAllowance <= balance.coverage.maxPerSession && remainingAllowance > 0) {
          alerts.push(
            `Only ${formatCurrency(remainingAllowance)} left for the year (roughly one session).`,
          );
        }

        if (utilizationPercent >= 75) {
          alerts.push(`Benefit ${utilizationPercent}% used this year.`);
        }

        return {
          balance,
          score,
          reasons,
          details: {
            id: balance.id,
            name: balance.name,
            type: balance.type,
            status: balance.status,
            amountRemaining: remainingAllowance,
            description: balance.description,
            expiryDate: balance.expiryDate,
            renewalDate: balance.renewalDate,
            daysUntilExpiry,
            daysUntilRenewal,
            coverage: {
              maxPerSession: balance.coverage.maxPerSession,
              maxPerYear: balance.coverage.maxPerYear,
              copay: balance.coverage.copay,
              remainingAllowance,
              amountUsedYearToDate: Number(totalUsed.toFixed(2)),
              utilizationPercent,
            },
            recentUsage,
            alerts,
          },
        };
      });

      const sorted = matches
        .sort((a, b) => b.score - a.score)
        .slice(0, topK ?? 3);

      const bestMatch = sorted[0];

      const assistantSummary = bestMatch
        ? `${bestMatch.details.name} balance has ${
            typeof bestMatch.details.coverage.remainingAllowance === "number"
              ? formatCurrency(bestMatch.details.coverage.remainingAllowance)
              : formatCurrency(bestMatch.details.amountRemaining)
          } remaining and ${
            bestMatch.details.daysUntilExpiry !== undefined
              ? bestMatch.details.daysUntilExpiry < 0
                ? "is already expired"
                : `expires ${
                    formatDateDisplay(bestMatch.details.expiryDate) ?? "soon"
                  }`
              : "has no expiry date on record"
          }.`
        : "No matching benefit found—let’s clarify which balance the patient meant.";

      const assistantHighlights = bestMatch
        ? [
            `Copay: ${formatCurrency(bestMatch.details.coverage.copay)} (max per session ${formatCurrency(bestMatch.details.coverage.maxPerSession)}).`,
            bestMatch.details.alerts.length > 0
              ? bestMatch.details.alerts.join(" ")
              : "No alerts—benefit looks healthy.",
          ]
        : [
            "Confirm the benefit name or specialty so we can pull the right coverage details.",
          ];

      const assistantNextSteps = bestMatch
        ? bestMatch.details.daysUntilExpiry !== undefined && bestMatch.details.daysUntilExpiry >= 0
          ? `Encourage the patient to use this benefit within the next ${bestMatch.details.daysUntilExpiry} day${bestMatch.details.daysUntilExpiry === 1 ? "" : "s"}.`
          : "Offer to book a visit now or explore alternative coverage."
        : "Clarify the request or offer to list available benefits.";

      const matchSummaries = sorted.map(({ details }) => ({
        id: details.id,
        name: details.name,
        remaining: formatCurrency(details.coverage.remainingAllowance),
        expiry: formatDateDisplay(details.expiryDate) ?? "No expiry on file",
        alerts: details.alerts,
        status: details.status,
      }));

      return {
        query,
        normalizedQuery,
        totalMatches: matches.length,
        assistantSummary,
        assistantHighlights,
        assistantNextSteps,
        matchSummaries,
        topMatches: sorted.map(({ details, score, reasons }) => ({
          ...details,
          match: {
            score: Number(score.toFixed(2)),
            reasons,
          },
        })),
        bestMatch: sorted.length > 0
          ? {
              ...sorted[0].details,
              match: {
                score: Number(sorted[0].score.toFixed(2)),
                reasons: sorted[0].reasons,
              },
            }
          : null,
        diagnostics: {
          wantsExpiry,
          wantsCopay,
          tokens,
        },
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
    
    // Use createUIMessageStream like ai-chatbot repo for proper tool + text handling
    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: openai(DEFAULT_MODEL),
          system: systemPrompt,
          messages: modelMessages,
          tools: tools,
          stopWhen: stepCountIs(5),
          temperature: 0.7,
          // Don't use experimental_activeTools - let AI decide when to use tools
          onFinish: async (result) => {
            console.log("🔍 API Route - AI finished with:", {
              text: result.text,
              textLength: result.text?.length || 0,
              toolCalls: result.toolCalls?.map(tc => ({ name: tc.toolName })),
              toolCallsCount: result.toolCalls?.length || 0,
              finishReason: result.finishReason
            });
            
            if (!result.text || result.text.length === 0) {
              console.warn("⚠️ AI generated NO conversational text - only tool calls!");
              console.warn("⚠️ This might be due to model configuration or prompt issues");
              console.warn("⚠️ System prompt:", systemPrompt.substring(0, 200) + "...");
            } else {
              console.log("✅ AI generated text successfully:", result.text.substring(0, 100) + "...");
            }
          },
          onError: (error) => {
            console.error("API Route - streamText error:", JSON.stringify(error, null, 2));
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
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
