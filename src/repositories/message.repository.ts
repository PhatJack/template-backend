import { MessageModel, type MessageRecord, type MessageInput } from "../models/message.model";

export type MessageResponse = {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: Date;
};

function toMessageResponse(m: MessageRecord): MessageResponse {
  return {
    id: m._id.toString(),
    conversationId: m.conversationId.toString(),
    role: m.role,
    content: m.content,
    createdAt: m.createdAt
  };
}

export async function listByConversation(conversationId: string, limit = 50, skip = 0): Promise<MessageResponse[]> {
  const messages = await MessageModel.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<MessageRecord[]>();

  return messages.map(toMessageResponse);
}

export async function createMessage(input: MessageInput): Promise<MessageResponse> {
  const created = await MessageModel.create(input);
  return toMessageResponse(created.toObject() as unknown as MessageRecord);
}
