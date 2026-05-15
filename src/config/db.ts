import mongoose from "mongoose";
import env from "./env";

type DbConnectionInfo = {
  client: "mongodb";
  host: string;
  name: string;
};

export async function connectDb(): Promise<DbConnectionInfo> {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(env.databaseUrl);
  }

  const { host, name } = mongoose.connection;

  return {
    client: "mongodb",
    host: host || env.database.host,
    name: name || env.database.name
  };
}

export async function closeDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
