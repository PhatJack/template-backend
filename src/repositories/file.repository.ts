import { FileModel, type FileRecord, type FileInput } from "../models/file.model.js";

export type FileResponse = {
  id: string;
  conversationId: string;
  messageId?: string | null;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
};

export function toFileResponse(f: FileRecord): FileResponse {
  return {
    id: f._id.toString(),
    conversationId: f.conversationId.toString(),
    messageId: f.messageId ? f.messageId.toString() : null,
    originalName: f.originalName,
    fileName: f.fileName,
    mimeType: f.mimeType,
    size: f.size,
    url: f.url,
    createdAt: f.createdAt
  };
}

export async function listByConversation(conversationId: string): Promise<FileResponse[]> {
  const files = await FileModel.find({ conversationId }).lean<FileRecord[]>();
  return files.map(toFileResponse);
}

export async function listByMessage(messageId: string): Promise<FileResponse[]> {
  const files = await FileModel.find({ messageId }).lean<FileRecord[]>();
  return files.map(toFileResponse);
}

export async function createFile(input: FileInput): Promise<FileResponse> {
  const created = await FileModel.create(input);
  return toFileResponse(created.toObject() as unknown as FileRecord);
}

export async function deleteFile(id: string): Promise<void> {
  await FileModel.findByIdAndDelete(id);
}
