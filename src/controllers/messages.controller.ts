import type { NextFunction, Request, Response } from "express";
import fs from "node:fs/promises";
import {
  listByConversation,
  listRecentConversationMessages,
  createMessage,
  getMessage,
  type MessageResponse,
} from "../repositories/message.repository.js";
import { createFile, listByMessage } from "../repositories/file.repository.js";
import {
  generateGeminiReply,
  getGeminiReplyModel,
  streamGeminiReply,
  type GeminiHistoryMessage,
} from "../services/gemini.service.js";
import {
  getSupportedGeminiMimeTypes,
  isSupportedGeminiMimeType,
} from "../utils/gemini-file-types.js";

function sendSseEvent(
  res: Response,
  event: string,
  data: Record<string, unknown>,
): void {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function getUploadedFiles(req: Request): Express.Multer.File[] {
  return Array.isArray(req.files) ? req.files : [];
}

async function cleanupUploadedFiles(files: Express.Multer.File[]): Promise<void> {
  await Promise.allSettled(files.map((file) => fs.unlink(file.path)));
}

function toGeminiHistory(messages: MessageResponse[]): GeminiHistoryMessage[] {
  return messages.reduce<GeminiHistoryMessage[]>((history, message) => {
    if (message.role === "USER") {
      history.push({ role: "user", parts: [{ text: message.content }] });
      return history;
    }

    history.push({ role: "model", parts: [{ text: message.content }] });
    return history;
  }, []);
}

export async function listMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const conversationId = String(req.query.conversationId || "");
    if (!conversationId)
      return res
        .status(400)
        .json({ success: false, message: "conversationId is required" });
    const msgs = await listByConversation(conversationId);
    return res.status(200).json({ success: true, data: msgs });
  } catch (error) {
    return next(error);
  }
}

export async function createMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const { conversationId, role, content } = req.body;
    if (!conversationId || !role || !content) {
      return res
        .status(400)
        .json({
          success: false,
          message: "conversationId, role and content are required",
        });
    }
    const created = await createMessage({ conversationId, role, content });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
}

export async function generateMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const uploadedFiles = getUploadedFiles(req);

  try {
    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "messageId is required",
      });
    }

    const sourceMessage = await getMessage(String(messageId));

    if (!sourceMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (sourceMessage.role !== "USER") {
      return res.status(400).json({
        success: false,
        message: "AI reply can only be generated for USER messages",
      });
    }

    const unsupportedFile = uploadedFiles.find(
      (file) => !isSupportedGeminiMimeType(file.mimetype),
    );

    if (unsupportedFile) {
      return res.status(415).json({
        success: false,
        message: `Unsupported file type "${unsupportedFile.mimetype || "unknown"}" for "${unsupportedFile.originalname}". Supported MIME types: ${getSupportedGeminiMimeTypes().join(", ")}`,
      });
    }

    const recentMessages = await listRecentConversationMessages(
      sourceMessage.conversationId,
    );
    const geminiReply = await generateGeminiReply(
      sourceMessage.content,
      uploadedFiles.map((file) => ({
        path: file.path,
        mimeType: file.mimetype,
      })),
      toGeminiHistory(recentMessages),
    );
    const assistantMessage = await createMessage({
      conversationId: sourceMessage.conversationId,
      role: "ASSISTANT",
      content: geminiReply.content,
    });

    if (geminiReply.files?.length) {
      await Promise.all(
        uploadedFiles.map((file, index) =>
          createFile({
            conversationId: sourceMessage.conversationId,
            messageId: sourceMessage.id,
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: geminiReply.files?.[index]?.uri || file.filename,
          }),
        ),
      );
    }

    return res.status(201).json({
      success: true,
      data: {
        model: geminiReply.model,
        sourceMessage,
        assistantMessage,
      },
    });
  } catch (error) {
    return next(error);
  } finally {
    await cleanupUploadedFiles(uploadedFiles);
  }
}

export async function streamMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const messageId = String(req.query.messageId || "");

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "messageId is required",
      });
    }

    const sourceMessage = await getMessage(messageId);

    if (!sourceMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (sourceMessage.role !== "USER") {
      return res.status(400).json({
        success: false,
        message: "AI reply can only be generated for USER messages",
      });
    }

    let clientClosed = false;
    req.on("close", () => {
      clientClosed = true;
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const chunks: string[] = [];

    try {
      const sourceFiles = await listByMessage(sourceMessage.id);
      const recentMessages = await listRecentConversationMessages(
        sourceMessage.conversationId,
      );

      for await (const text of streamGeminiReply(
        sourceMessage.content,
        sourceFiles.map((file) => ({
          uri: file.url,
          mimeType: file.mimeType,
        })),
        toGeminiHistory(recentMessages),
      )) {
        if (clientClosed || res.writableEnded) {
          return;
        }

        chunks.push(text);
        sendSseEvent(res, "chunk", { text });
      }

      if (clientClosed || res.writableEnded) {
        return;
      }

      const content = chunks.join("").trim();
      if (!content) {
        sendSseEvent(res, "error", {
          message: "Gemini returned an empty response",
        });
        return res.end();
      }

      const assistantMessage = await createMessage({
        conversationId: sourceMessage.conversationId,
        role: "ASSISTANT",
        content,
      });

      sendSseEvent(res, "done", {
        model: getGeminiReplyModel(),
        assistantMessage,
      });
      return res.end();
    } catch (error) {
      if (!clientClosed && !res.writableEnded) {
        sendSseEvent(res, "error", {
          message:
            error instanceof Error
              ? error.message
              : "Unexpected stream failure",
        });
        return res.end();
      }
    }
  } catch (error) {
    return next(error);
  }
}

export const MessageController = {
  listMessages,
  createMessageHandler,
  generateMessageHandler,
  streamMessageHandler,
};
