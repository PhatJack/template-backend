import type { NextFunction, Request, Response } from "express";
import { createUser as createUserRecord, listUsers as listUsersRecords } from "../repositories/user.repository.js";

export async function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const users = await listUsersRecords();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const created = await createUserRecord({ name, email, password });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
}

export const UserController = {
  listUsers,
  createUser,
};
