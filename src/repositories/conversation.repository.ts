import { ConversationModel, type ConversationRecord, type ConversationInput } from "../models/conversation.model";
import { MessageModel } from "../models/message.model";
import { FileModel } from "../models/file.model";

export type ConversationResponse = {
  id: string;
  title?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toConversationResponse(rec: ConversationRecord): ConversationResponse {
  return {
    id: rec._id.toString(),
    title: rec.title ?? null,
    userId: rec.userId ? rec.userId.toString() : null,
    createdAt: rec.createdAt,
    updatedAt: rec.updatedAt
  };
}

export async function listByUser(userId: string): Promise<ConversationResponse[]> {
  const convs = await ConversationModel.find({ userId }).sort({ createdAt: -1 }).lean<ConversationRecord[]>();
  return convs.map(toConversationResponse);
}

export async function getConversation(id: string): Promise<ConversationResponse | null> {
  const conv = await ConversationModel.findById(id).lean<ConversationRecord | null>();
  return conv ? toConversationResponse(conv) : null;
}

export async function createConversation(input: ConversationInput): Promise<ConversationResponse> {
  const created = await ConversationModel.create({ title: input.title ?? null, userId: input.userId ?? null });
  return toConversationResponse(created.toObject() as unknown as ConversationRecord);
}

export async function updateConversation(id: string, data: Partial<ConversationInput>): Promise<ConversationResponse | null> {
  const updated = await ConversationModel.findByIdAndUpdate(id, data, { new: true }).lean<ConversationRecord | null>();
  return updated ? toConversationResponse(updated) : null;
}

export async function deleteConversationCascade(id: string): Promise<void> {
  // Delete files referencing the conversation
  await FileModel.deleteMany({ conversationId: id });
  // Delete messages referencing the conversation
  await MessageModel.deleteMany({ conversationId: id });
  // Delete the conversation itself
  await ConversationModel.findByIdAndDelete(id);
}
