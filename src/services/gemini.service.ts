import { GoogleGenAI } from "@google/genai";
import env from "../config/env";

type HttpError = Error & {
  status?: number;
};

let client: GoogleGenAI | null = null;
// const DEFAULT_GEMINI_MODEL = "gemini-3-flash-preview";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const SYSTEM_INSTRUCTION = `You are a friendly and helpful AI assistant.

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
- ALWAYS format your response using Markdown. DO NOT use HTML tags.
- Use **bold** for important keywords.
- Use headings (#, ##, ###) to structure answers.
- Use bullet points (-) or numbered lists (1. 2. 3.) when listing items.
- Use \`code\` for inline technical terms.
- Use \`\`\` blocks for multi-line code snippets.

STYLE:
- Concise but informative
- Prioritize practical, actionable answers
- Always be polite and respectful`;

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

function getGeminiModel(): string {
  return env.geminiModel || DEFAULT_GEMINI_MODEL;
}

export type GeminiReply = {
  model: string;
  content: string;
};

export async function generateGeminiReply(
  prompt: string,
): Promise<GeminiReply> {
  const response = await getClient().models.generateContent({
    model: getGeminiModel(),
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  });

  const content = response.text?.trim();
  if (!content) {
    throw createHttpError("Gemini returned an empty response", 502);
  }

  return {
    model: getGeminiModel(),
    content,
  };
}

export async function* streamGeminiReply(
  prompt: string,
): AsyncGenerator<string> {
  const response = await getClient().models.generateContentStream({
    model: getGeminiModel(),
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}

export function getGeminiReplyModel(): string {
  return getGeminiModel();
}

export async function generateTitleConversation(
  prompt: string,
): Promise<string> {
  const response = await getClient().models.generateContent({
    model: getGeminiModel(),
    contents: `Generate a concise and descriptive title (max 5 words) for a conversation based on this message: ${prompt}`,
    config: {
      temperature: 0.7,
    },
  });
  const title = response.text?.trim();
  if (!title) {
    throw createHttpError("Failed to generate conversation title", 502);
  }
  return title;
}
