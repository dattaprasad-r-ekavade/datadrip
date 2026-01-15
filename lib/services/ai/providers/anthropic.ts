import type { AIProvider } from "@prisma/client";

export const callAnthropic = async (provider: AIProvider, prompt: string) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": provider.apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model ?? "claude-3-haiku-20240307",
      max_tokens: 300,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic error: ${text}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ text?: string }>;
    model?: string;
  };

  const text = data.content?.[0]?.text?.trim() ?? "";
  return { text, model: data.model ?? provider.model ?? null };
};
