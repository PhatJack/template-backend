import { Schema, model, type Types } from "mongoose";

export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export type MessageInput = {
  conversationId: Types.ObjectId | string;
  role: MessageRole;
  content: string;
};

export type MessageRecord = MessageInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const messageSchema = new Schema<MessageInput>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    role: { type: String, enum: ["USER", "ASSISTANT", "SYSTEM"], required: true },
    content: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
);

// Compound index for conversation message ordering
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const MessageModel = model<MessageInput>("Message", messageSchema);
