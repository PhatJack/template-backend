import dotenv from "dotenv";

// Render injects environment variables at runtime, so missing .env file is normal.
// quiet avoids misleading logs like "injected env (0) from .env" in production.
dotenv.config({ quiet: true });

const databaseUrl =
  process.env.MONGODB_URI ||
  "mongodb://root:password@localhost:27017/template_backend";

const uploadMaxFileSizeMb = Number(process.env.UPLOAD_MAX_FILE_SIZE_MB || 20);

function parseCorsOrigin(value: string | undefined): string[] {
  if (!value) {
    return ["http://localhost:3000", "http://localhost:5173"];
  }

  const trimmed = value.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }

    if (typeof parsed === "string") {
      return [parsed];
    }
  } catch {
    // Support comma-separated or single origin values from hosting dashboards.
    return trimmed
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  return ["http://localhost:3000", "http://localhost:5173"];
}

function parseDatabaseInfo(url: string): { host: string; name: string } {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.host,
      name: parsed.pathname.replace(/^\//, "") || "unknown",
    };
  } catch {
    return {
      host: "unknown",
      name: "unknown",
    };
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  dbClient: "mongodb",
  databaseUrl,
  database: parseDatabaseInfo(databaseUrl),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
	jwtSecret: process.env.JWT_SECRET || "default_secret",
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  uploadMaxFileSizeMb,
  uploadMaxFileSizeBytes: uploadMaxFileSizeMb * 1024 * 1024,
};

export default env;
