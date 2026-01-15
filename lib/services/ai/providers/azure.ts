import type { AIProvider } from "@prisma/client";

export const callAzureOpenAI = async (provider: AIProvider, prompt: string) => {
  const endpoint = (provider.metadata as { endpoint?: string } | null)?.endpoint;
  if (!endpoint) {
    throw new Error("Azure OpenAI endpoint missing in metadata");
  }

  const deployment = provider.model ?? "gpt-4o-mini";
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": provider.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    throw new Error(`Azure OpenAI error: ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  return { text, model: deployment };
};
