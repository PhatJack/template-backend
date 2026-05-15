import type { NextFunction, Request, Response } from "express";
import { listByConversation, createFile, deleteFile } from "../repositories/file.repository";

export async function listFiles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const conversationId = String(req.query.conversationId || "");
    if (!conversationId) return res.status(400).json({ success: false, message: "conversationId is required" });
    const files = await listByConversation(conversationId);
    return res.status(200).json({ success: true, data: files });
  } catch (error) {
    return next(error);
  }
}

export async function createFileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { conversationId, url, size, originalName, fileName, mimeType } = req.body;
    if (!conversationId || !url) {
      return res.status(400).json({ success: false, message: "conversationId and url are required" });
    }
    const created = await createFile({
      conversationId,
      url,
      size,
      originalName: originalName || fileName || "",
      fileName: fileName || originalName || "",
      mimeType: mimeType || "application/octet-stream",
    });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
}

export async function deleteFileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const id = String(req.params.id);
    await deleteFile(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export const FileController = {
  listFiles,
  createFileHandler,
  deleteFileHandler,
};
