import type { NextFunction, Request, Response } from "express";
import {
  listByUser,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversationCascade,
} from "../repositories/conversation.repository";

export async function listConversations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = String(req.query.userId || "");
    const convs = userId ? await listByUser(userId) : [];
    return res.status(200).json({ success: true, data: convs });
  } catch (error) {
    return next(error);
  }
}

export async function getConversationById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const id = String(req.params.id);
    const conv = await getConversation(id);
    if (!conv) return res.status(404).json({ success: false, message: "Conversation not found" });
    return res.status(200).json({ success: true, data: conv });
  } catch (error) {
    return next(error);
  }
}

export async function createConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { title, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }
    const created = await createConversation({ title, userId });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
}

export async function updateConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const id = String(req.params.id);
    const updated = await updateConversation(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Conversation not found" });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return next(error);
  }
}

export async function deleteConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const id = String(req.params.id);
    await deleteConversationCascade(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export const ConversationController = {
  listConversations,
  getConversationById,
  createConversationHandler,
  updateConversationHandler,
  deleteConversationHandler,
};
