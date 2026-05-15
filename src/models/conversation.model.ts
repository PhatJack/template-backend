import { Schema, model, type Types } from "mongoose";

export type ConversationInput = {
  title?: string | null;
  userId?: Types.ObjectId | string | null;
};

export type ConversationRecord = ConversationInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const conversationSchema = new Schema<ConversationInput>(
  {
    title: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true, versionKey: false }
);

export const ConversationModel = model<ConversationInput>("Conversation", conversationSchema);
