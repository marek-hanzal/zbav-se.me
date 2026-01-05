import { AppEnvSchema } from "~/schema/AppEnvSchema";

export const AppEnv = AppEnvSchema.parse(process.env);
