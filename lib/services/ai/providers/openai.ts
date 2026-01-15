import type { AIProvider } from "@prisma/client";

export const callOpenAI = async (provider: AIProvider, prompt: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful marketing analyst." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    model?: string;
  };

  return {
    text: data.choices?.[0]?.message?.content?.trim() ?? "",
    model: data.model ?? provider.model ?? null,
  };
};
