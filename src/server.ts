import app from "./app.js";
import env from "./config/env.js";
import { closeDb, connectDb } from "./config/db.js";

async function startServer(): Promise<void> {
  const db = await connectDb();
  console.log(`Database connected: ${db.client} (${db.host}/${db.name})`);

  const server = app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port} (MongoDB)`);
  });

  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    console.log(`${signal} received. Shutting down...`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
