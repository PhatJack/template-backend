import { GoogleGenAI } from "@google/genai";
import env from "../config/env";

type HttpError = Error & {
  status?: number;
};

let client: GoogleGenAI | null = null;

function createHttpError(message: string, status: number): HttpError {
  const error = new Error(message) as HttpError;
  error.status = status;
  return error;
}

function getClient(): GoogleGenAI {
  if (!env.geminiApiKey) {
    throw createHttpError("GEMINI_API_KEY is required", 500);
  }

  client ??= new GoogleGenAI({ apiKey: env.geminiApiKey });
  return client;
}

export type GeminiReply = {
  model: string;
  content: string;
};

export async function generateGeminiReply(
  prompt: string,
): Promise<GeminiReply> {
  const response = await getClient().models.generateContent({
    model: env.geminiModel || "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are a friendly and helpful AI assistant.

LANGUAGE DETECTION:
- Detect the language of the user's message automatically
- Respond in the SAME language as the user's input
- If user writes in Vietnamese, respond in Vietnamese
- If user writes in English, respond in English
- If user writes in another language, respond in that language

TASKS:
- Answer user questions accurately and concisely
- Use clear and approachable language
- If you don't know the answer, admit it instead of guessing

MARKDOWN FORMATTING:
- Use **bold** for important keywords
- Use headings (# ## ###) to structure answers
- Use bullet points (-) or numbered lists (1. 2. 3.) when listing items
- Use \`code\` for technical terms
- Use code blocks (\`\`\`) for code snippets

STYLE:
- Concise but informative
- Prioritize practical, actionable answers
- Always be polite and respectful`,
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  });

  const content = response.text?.trim();
  if (!content) {
    throw createHttpError("Gemini returned an empty response", 502);
  }

  return {
    model: env.geminiModel || "gemini-3-flash-preview",
    content,
  };
}

export async function generateTitleConversation(
  prompt: string,
): Promise<string> {
  const response = await getClient().models.generateContent({
    model: env.geminiModel || "gemini-3-flash-preview",
    contents: `Generate a concise and descriptive title (max 5 words) for a conversation based on this message: ${prompt}`,
    config: {
      temperature: 0.7,
      maxOutputTokens: 10,
    },
  });
  const title = response.text?.trim();
  if (!title) {
    throw createHttpError("Failed to generate conversation title", 502);
  }
  return title;
}
