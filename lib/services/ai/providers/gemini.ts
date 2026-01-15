import type { AIProvider } from "@prisma/client";

export const callGemini = async (provider: AIProvider, prompt: string) => {
  const model = provider.model ?? "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${provider.apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini error: ${text}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  return { text, model };
};
