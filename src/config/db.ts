import env from "./env";
import prisma from "./prisma";

type DbConnectionInfo = {
  client: "mysql";
  host: string;
  name: string;
};

export async function connectDb(): Promise<DbConnectionInfo> {
  await prisma.$connect();
  return {
    client: "mysql",
    host: env.database.host,
    name: env.database.name,
  };
}

export async function closeDb(): Promise<void> {
  await prisma.$disconnect();
}
