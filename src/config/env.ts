import dotenv from "dotenv";

dotenv.config();

const databaseUrl =
  process.env.MONGODB_URI ||
  "mongodb://root:password@localhost:27017/template_backend";

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
};

export default env;
