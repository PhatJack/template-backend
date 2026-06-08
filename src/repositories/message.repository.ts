import { FileModel, FileRecord } from "../models/file.model.js";
import {
  MessageModel,
  type MessageRecord,
  type MessageInput,
  type MessageRole,
} from "../models/message.model.js";
import { FileResponse, toFileResponse } from "./file.repository.js";

export type MessageResponse = {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
};

function toMessageResponse(m: MessageRecord): MessageResponse {
  return {
    id: m._id.toString(),
    conversationId: m.conversationId.toString(),
    role: m.role,
    content: m.content,
    createdAt: m.createdAt,
  };
}

export async function listByConversation(
  conversationId: string,
  limit = 50,
  skip = 0,
): Promise<MessageResponse[]> {
  const messages = await MessageModel.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<MessageRecord[]>();

  const messageIds = messages.map((m) => m._id);

  const files = await FileModel.find({
    messageId: { $in: messageIds },
  })
    .sort({ createdAt: 1 })
    .lean<FileRecord[]>();

  const filesByMessageId = files.reduce<Record<string, FileResponse[]>>(
    (acc, file) => {
      if (!file.messageId) return acc;

      const messageId = String(file.messageId);

      if (!acc[messageId]) {
        acc[messageId] = [];
      }

      acc[messageId].push(toFileResponse(file));

      return acc;
    },
    {},
  );

  return messages.map((message) => ({
    ...toMessageResponse(message),
    files: filesByMessageId[String(message._id)] ?? [],
  }));
}

export async function getMessage(id: string): Promise<MessageResponse | null> {
  const message = await MessageModel.findById(id).lean<MessageRecord | null>();
  return message ? toMessageResponse(message) : null;
}

export async function listRecentConversationMessages(
  conversationId: string,
  limit = 10,
): Promise<MessageResponse[]> {
  const messages = await MessageModel.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<MessageRecord[]>();

  return messages.reverse().map(toMessageResponse);
}

export async function createMessage(
  input: MessageInput,
): Promise<MessageResponse> {
  const created = await MessageModel.create(input);
  return toMessageResponse(created.toObject() as unknown as MessageRecord);
}
