import app from "./app";
import env from "./config/env";
import { closeDb, connectDb } from "./config/db";

async function startServer(): Promise<void> {
  const db = await connectDb();
  console.log(`Database connected: ${db.client} (${db.host}/${db.name})`);

  const server = app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port} (MySQL)`);
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
