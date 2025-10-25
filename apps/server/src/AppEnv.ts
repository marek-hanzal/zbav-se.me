import { z } from "zod";

const AppEnvSchema = z.object({
	SERVER_DATABASE_URL: z.string().min(1, "Database URL is required"),
	DOMAIN: z.string().min(1, "Domain is required"),
	WEB_ORIGIN: z
		.string()
		.min(1, "Web domain ORIGIN is required (used for CORS and auth)"),
	APP_ORIGIN: z
		.string()
		.min(1, "App domain ORIGIN is required (used for CORS and auth)"),
	SERVER_BETTER_AUTH_SECRET: z
		.string()
		.min(1, "Better Auth secret is required"),
	SERVER_JWT_SECRET: z.string().min(1, "JWT secret is required"),
	SERVER_GEOAPIFY_TOKEN: z.string().min(1, "Geoapify API key is required"),
	VITE_SERVER_API: z.string().min(1, "Server API is required"),
	SERVER_UPSTASH_REDIS_REST_URL: z.string().min(1, "Upstash URL is required"),
	SERVER_UPSTASH_REDIS_REST_TOKEN: z
		.string()
		.min(1, "Upstash token is required"),
	SERVER_S3_API: z.string().min(1, "S3 API endpoint is required"),
	SERVER_S3_KEY: z.string().min(1, "S3 key is required"),
	SERVER_S3_SECRET: z.string().min(1, "S3 secret is required"),
	SERVER_S3_BUCKET: z.string().min(1, "S3 bucket is required"),
});

export const AppEnv = AppEnvSchema.parse(process.env);
