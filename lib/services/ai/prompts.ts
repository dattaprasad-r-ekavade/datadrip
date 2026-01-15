import type { InsightType } from "@prisma/client";

export const buildInsightPrompt = ({
  type,
  summary,
}: {
  type: InsightType;
  summary: string;
}) => {
  const title = type.replace(/_/g, " ");
  return `You are a performance marketing analyst. Provide a concise ${title.toLowerCase()} recommendation.

Context:
${summary}

Return a short recommendation and an impact score (1-100).`;
};
