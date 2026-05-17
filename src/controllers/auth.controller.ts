import type { NextFunction, Request, Response } from "express";
import { createHash } from "node:crypto";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../repositories/user.repository";
import { signAccessToken } from "@/utils/jwt";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const created = await createUser({ name, email, password });
    const accessToken = signAccessToken({
      id: created.id,
      email: created.email,
    });

    return res.status(201).json({
      success: true,
      data: {
        ...created,
        accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await getUserByEmail(email);
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = signAccessToken({
      id: user._id.toString(),
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const user = await getUserById(req.auth.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export const AuthController = {
  register,
  login,
  me,
};
