import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";

export async function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
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
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Both name and email are required"
      });
    }

    const created = await prisma.user.create({
      data: { name, email }
    });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return next(error);
  }
}
