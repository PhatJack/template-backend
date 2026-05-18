import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import env from "../config/env.js";

export const uploadTempDir = path.join(process.cwd(), "uploads", "tmp");

fs.mkdirSync(uploadTempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadTempDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: env.uploadMaxFileSizeBytes,
  },
});

export function uploadMessageFiles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.array("files")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: `File size exceeds ${env.uploadMaxFileSizeMb}MB limit`,
      });
    }

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "File upload failed",
    });
  });
}
