import { PrismaClient } from "@prisma/client";

let db;

if (!db) {
  db = new PrismaClient({ log: ["query"] });
}

export { db };
