import { GoogleGenAI, type File as GeminiFile, type Part } from "@google/genai";
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

function isHttpError(error: unknown): error is HttpError {
  return error instanceof Error && typeof (error as HttpError).status === "number";
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
  files?: GeminiUploadedFile[];
};

export type GeminiAttachment = {
  path: string;
  mimeType: string;
};

export type GeminiUploadedFile = {
  name: string;
  uri: string;
  mimeType: string;
};

export type GeminiFileReference = {
  uri: string;
  mimeType: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForActiveFile(file: GeminiFile): Promise<GeminiFile> {
  if (!file.name) {
    throw createHttpError("Gemini file upload did not return a file name", 502);
  }

  let current = file;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (current.state === "ACTIVE" || !current.state) {
      return current;
    }

    if (current.state === "FAILED") {
      throw createHttpError(
        current.error?.message || "Gemini failed to process uploaded file",
        502,
      );
    }

    await sleep(1000);
    current = await getClient().files.get({ name: file.name });
  }

  throw createHttpError("Gemini file processing timed out", 504);
}

export async function uploadAttachmentToGemini(
  attachment: GeminiAttachment,
): Promise<GeminiUploadedFile> {
  let activeFile: GeminiFile;

  try {
    const uploaded = await getClient().files.upload({
      file: attachment.path,
      config: {
        mimeType: attachment.mimeType,
      },
    });
    activeFile = await waitForActiveFile(uploaded);
  } catch (error) {
    if (isHttpError(error)) {
      throw error;
    }

    throw createHttpError(
      `Gemini rejected or failed to upload file: ${
        error instanceof Error ? error.message : "Unknown upload error"
      }`,
      502,
    );
  }

  if (!activeFile.name || !activeFile.uri || !activeFile.mimeType) {
    throw createHttpError("Gemini returned incomplete file metadata", 502);
  }

  return {
    name: activeFile.name,
    uri: activeFile.uri,
    mimeType: activeFile.mimeType,
  };
}

function createGeminiContents(
  prompt: string,
  files: GeminiFileReference[],
) {
  if (files.length === 0) {
    return prompt;
  }

  return [
    {
      role: "user",
      parts: [
        { text: prompt },
        ...files.map<Part>((file) => ({
          fileData: {
            fileUri: file.uri,
            mimeType: file.mimeType,
          },
        })),
      ],
    },
  ];
}

export async function generateGeminiReply(
  prompt: string,
  attachments: GeminiAttachment[] = [],
): Promise<GeminiReply> {
  const uploadedFiles = attachments.length
    ? await Promise.all(attachments.map(uploadAttachmentToGemini))
    : [];
  const contents = createGeminiContents(prompt, uploadedFiles);

  let response: Awaited<
    ReturnType<ReturnType<typeof getClient>["models"]["generateContent"]>
  >;

  try {
    response = await getClient().models.generateContent({
      model: getGeminiModel(),
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });
  } catch (error) {
    throw createHttpError(
      `Gemini failed to generate a response${
        uploadedFiles.length ? " with uploaded file attachments" : ""
      }: ${error instanceof Error ? error.message : "Unknown generation error"}`,
      502,
    );
  }

  const content = response.text?.trim();
  if (!content) {
    throw createHttpError("Gemini returned an empty response", 502);
  }

  return {
    model: getGeminiModel(),
    content,
    files: uploadedFiles,
  };
}

export async function* streamGeminiReply(
  prompt: string,
  files: GeminiFileReference[] = [],
): AsyncGenerator<string> {
  const contents = createGeminiContents(prompt, files);
  const response = await getClient().models.generateContentStream({
    model: getGeminiModel(),
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      // * yield được dùng trong generator function để trả về một giá trị tạm thời và
      // * tạm dừng thực thi cho đến khi giá trị tiếp theo được yêu cầu.
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
      systemInstruction:
        "You are a title generator. Return ONLY the raw text of the title. Do not include quotes, markdown, prefixes, or any conversational filler.",
    },
  });

  const title = response.text?.trim();

  if (!title) {
    throw createHttpError("Failed to generate conversation title", 502);
  }

  return title;
}
