import { userModel, type UserInput, type UserRecord } from "../models/user.model";

export type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toUserResponse(user: UserRecord): UserResponse {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function listUsers(): Promise<UserResponse[]> {
  const users = await userModel.find().sort({ createdAt: -1 }).lean<UserRecord[]>();

  return users.map(toUserResponse);
}

export async function createUser(input: UserInput): Promise<UserResponse> {
  const created = await userModel.create({
    email: input.email,
    name: input.name ?? null
  });

  return toUserResponse(created.toObject() as unknown as UserRecord);
}

export async function getUserByEmail(email: string): Promise<UserResponse | null> {
	const user = await userModel.findOne({ email }).lean<UserRecord | null>();
	return user ? toUserResponse(user) : null;
}