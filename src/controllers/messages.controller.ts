import type { NextFunction, Request, Response } from "express";
import { listByConversation, createMessage } from "../repositories/message.repository";

export async function listMessages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const conversationId = String(req.query.conversationId || "");
    if (!conversationId) return res.status(400).json({ success: false, message: "conversationId is required" });
    const msgs = await listByConversation(conversationId);
    return res.status(200).json({ success: true, data: msgs });
  } catch (error) {
    return next(error);
  }
}

export async function createMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { conversationId, role, content } = req.body;
    if (!conversationId || !role || !content) {
      return res.status(400).json({ success: false, message: "conversationId, role and content are required" });
    }
    const created = await createMessage({ conversationId, role, content });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
}

export const MessageController = {
  listMessages,
  createMessageHandler,
};
