import type { NextFunction, Request, Response } from "express";
import {
  listByConversation,
  createMessage,
  getMessage,
} from "../repositories/message.repository";
import { generateGeminiReply } from "../services/gemini.service";

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

    const geminiReply = await generateGeminiReply(sourceMessage.content);
    const assistantMessage = await createMessage({
      conversationId: sourceMessage.conversationId,
      role: "ASSISTANT",
      content: geminiReply.content,
    });

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
  }
}

export const MessageController = {
  listMessages,
  createMessageHandler,
  generateMessageHandler,
};
