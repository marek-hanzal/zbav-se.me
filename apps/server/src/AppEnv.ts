import { z } from "zod";

const ServerS3Schema = z.object({
	SERVER_S3_API: z.string().min(1, "S3 API endpoint is required"),
	SERVER_S3_KEY: z.string().min(1, "S3 key is required"),
	SERVER_S3_SECRET: z.string().min(1, "S3 secret is required"),
	SERVER_S3_BUCKET: z.string().min(1, "S3 bucket is required"),
});

const ServerUpstashSchema = z.object({
	SERVER_UPSTASH_REDIS_URL: z.string().min(1, "Upstash URL is required"),
	SERVER_UPSTASH_REDIS_TOKEN: z.string().min(1, "Upstash token is required"),
});

const ServerDatabaseSchema = z.object({
	SERVER_DATABASE_URL: z.string().min(1, "Database URL is required"),
});

const ServerOriginSchema = z.object({
	VITE_WEB_ORIGIN: z
		.string()
		.min(1, "Web domain ORIGIN is required (used for CORS and auth)"),
	VITE_APP_ORIGIN: z
		.string()
		.min(1, "App domain ORIGIN is required (used for CORS and auth)"),
});

const AppEnvSchema = z.object({
	VITE_DOMAIN: z.string().min(1, "Domain is required"),
	...ServerOriginSchema.shape,
	SERVER_BETTER_AUTH_SECRET: z
		.string()
		.min(1, "Better Auth secret is required"),
	SERVER_JWT_SECRET: z.string().min(1, "JWT secret is required"),
	SERVER_GEOAPIFY_TOKEN: z.string().min(1, "Geoapify API key is required"),
	...ServerOriginSchema.shape,
	...ServerDatabaseSchema.shape,
	...ServerUpstashSchema.shape,
	...ServerS3Schema.shape,
});

export const AppEnv = AppEnvSchema.parse(process.env);
