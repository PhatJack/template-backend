import { Schema, model, type Types } from "mongoose";

export type FileInput = {
  conversationId: Types.ObjectId | string;
  messageId?: Types.ObjectId | string | null;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
};

export type FileRecord = FileInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const fileSchema = new Schema<FileInput>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    messageId: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
);

export const FileModel = model<FileInput>("File", fileSchema);
