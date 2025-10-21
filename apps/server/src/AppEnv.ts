import { z } from "zod";

const AppEnvSchema = z.object({
	DATABASE_URL: z.string().min(1, "Database URL is required"),
	ORIGIN: z
		.string()
		.min(1, "Domain ORIGIN is required (used for CORS and auth)"),
	BETTER_AUTH_SECRET: z.string().min(1, "Better Auth secret is required"),
	JWT_SECRET: z.string().min(1, "JWT secret is required"),
	VERCEL_BLOB: z.string().min(1, "Vercel blob is required"),
	GEOAPIFY: z.string().min(1, "Geoapify API key is required"),
	VITE_API: z.string().min(1, "Vite API is required"),
	UPSTASH_REDIS_REST_URL: z.string().min(1, "Upstash URL is required"),
	UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "Upstash token is required"),
});

export const AppEnv = AppEnvSchema.parse(process.env);
