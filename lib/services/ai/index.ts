import type { AIProvider, InsightType } from "@prisma/client";
import { buildInsightPrompt } from "@/lib/services/ai/prompts";
import { callOpenAI } from "@/lib/services/ai/providers/openai";
import { callAnthropic } from "@/lib/services/ai/providers/anthropic";
import { callGemini } from "@/lib/services/ai/providers/gemini";
import { callAzureOpenAI } from "@/lib/services/ai/providers/azure";

interface AICompletion {
  text: string;
  model: string | null;
}

const callProvider = async (provider: AIProvider, prompt: string): Promise<AICompletion> => {
  switch (provider.provider) {
    case "OPENAI":
      return callOpenAI(provider, prompt);
    case "ANTHROPIC":
      return callAnthropic(provider, prompt);
    case "GOOGLE_GEMINI":
      return callGemini(provider, prompt);
    case "AZURE_OPENAI":
      return callAzureOpenAI(provider, prompt);
    default:
      throw new Error(`Provider ${provider.provider} not implemented`);
  }
};

export const generateInsightText = async ({
  provider,
  type,
  summary,
}: {
  provider: AIProvider;
  type: InsightType;
  summary: string;
}) => {
  const prompt = buildInsightPrompt({ type, summary });
  return callProvider(provider, prompt);
};
