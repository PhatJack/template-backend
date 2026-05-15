import type { Request, Response } from "express";
import env from "../config/env";

export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    message: "API is running",
    data: {
      env: env.nodeEnv,
      dbClient: env.dbClient,
      database: env.database.name
    }
  });
}

export const HealthController = {
  getHealth,
};
