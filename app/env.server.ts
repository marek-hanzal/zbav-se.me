import { z } from "zod";

const ServerSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string(),
});

export const serverEnv = () => ServerSchema.parse(process.env);
