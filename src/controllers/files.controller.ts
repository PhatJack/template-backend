import type { NextFunction, Request, Response } from "express";
import fs from "node:fs/promises";
import {
  listByConversation,
  createFile,
  deleteFile,
} from "../repositories/file.repository";
import { uploadAttachmentToGemini } from "../services/gemini.service";
import {
  getSupportedGeminiMimeTypes,
  isSupportedGeminiMimeType,
} from "../utils/gemini-file-types";

function getUploadedFiles(req: Request): Express.Multer.File[] {
  return Array.isArray(req.files) ? req.files : [];
}

async function cleanupUploadedFiles(files: Express.Multer.File[]): Promise<void> {
  await Promise.allSettled(files.map((file) => fs.unlink(file.path)));
}

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
  const uploadedFiles = getUploadedFiles(req);

  try {
    const { conversationId, messageId, url, size, originalName, fileName, mimeType } = req.body;

    if (uploadedFiles.length > 0) {
      if (!conversationId || !messageId) {
        return res.status(400).json({
          success: false,
          message: "conversationId and messageId are required",
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

      const created = await Promise.all(
        uploadedFiles.map(async (file) => {
          const geminiFile = await uploadAttachmentToGemini({
            path: file.path,
            mimeType: file.mimetype,
          });

          return createFile({
            conversationId,
            messageId,
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: geminiFile.uri,
          });
        }),
      );

      return res.status(201).json({
        success: true,
        data: created.length === 1 ? created[0] : created,
      });
    }

    if (!conversationId || !url) {
      return res.status(400).json({ success: false, message: "conversationId and url are required" });
    }
    const created = await createFile({
      conversationId,
      messageId: messageId ?? null,
      url,
      size,
      originalName: originalName || fileName || "",
      fileName: fileName || originalName || "",
      mimeType: mimeType || "application/octet-stream",
    });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  } finally {
    await cleanupUploadedFiles(uploadedFiles);
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
