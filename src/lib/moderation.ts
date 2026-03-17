export interface ModerationResult {
  flagged: boolean;
  reason?: string;
}

/**
 * Check content against LLM moderation API.
 * Returns { flagged: false } if no API key is configured (graceful degradation).
 */
export async function checkContent(text: string): Promise<ModerationResult> {
  const apiKey = process.env.LLM_MODERATION_API_KEY;
  const provider = process.env.LLM_MODERATION_PROVIDER;

  if (!apiKey || !provider) {
    return { flagged: false };
  }

  try {
    if (provider === "openai") {
      return await checkWithOpenAI(text, apiKey);
    } else if (provider === "anthropic") {
      return await checkWithAnthropic(text, apiKey);
    }
    return { flagged: false };
  } catch (error) {
    console.error("Moderation check failed:", error);
    // On error, don't block content but log the failure
    return { flagged: false };
  }
}

async function checkWithOpenAI(
  text: string,
  apiKey: string
): Promise<ModerationResult> {
  const res = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: text }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI moderation API error: ${res.status}`);
  }

  const data = await res.json();
  const result = data.results?.[0];

  if (result?.flagged) {
    const categories = Object.entries(result.categories || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ");
    return { flagged: true, reason: `Flagged categories: ${categories}` };
  }

  return { flagged: false };
}

async function checkWithAnthropic(
  text: string,
  apiKey: string
): Promise<ModerationResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `You are a content moderator. Analyze if the following text contains hate speech, harassment, violence, sexual content, self-harm, or other harmful content. Reply with JSON only: {"flagged": true/false, "reason": "brief reason if flagged"}\n\nText: ${text}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic moderation API error: ${res.status}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text || "";

  try {
    return JSON.parse(content);
  } catch {
    return { flagged: false };
  }
}
