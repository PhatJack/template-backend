import { Schema, model, type Types } from "mongoose";

export type UserInput = {
  email: string;
  name?: string | null;
};

export type UserRecord = UserInput & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserInput>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const userModel = model<UserInput>("User", userSchema);