import { type Config } from "drizzle-kit";
import { serverEnv } from "~/env.server";

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv().DATABASE_URL,
  },
} satisfies Config;
