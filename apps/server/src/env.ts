import { z } from "zod";

declare const __ORIGIN__: string | undefined;
declare const __COOKIE__: string | undefined;
declare const __DATABASE_URL__: string | undefined;
declare const __BETTER_AUTH_SECRET__: string | undefined;
declare const __GEOAPIFY__: string | undefined;
declare const __VERCEL_BLOB__: string | undefined;
declare const __VITE_API__: string | undefined;

const AppEnvSchema = z.object({
	DATABASE_URL: z.string().min(1, "Database URL is required"),
	ORIGIN: z
		.string()
		.min(1, "Domain ORIGIN is required (used for CORS and auth)"),
	COOKIE: z.string().min(1, "Cookie domain is required"),
	BETTER_AUTH_SECRET: z.string().min(1, "Better Auth secret is required"),
	VERCEL_BLOB: z.string().min(1, "Vercel blob is required"),
	GEOAPIFY: z.string().min(1, "Geoapify API key is required"),
	VITE_API: z.string().min(1, "Vite API is required"),
});

export const AppEnv = AppEnvSchema.parse({
	DATABASE_URL:
		typeof __DATABASE_URL__ !== "undefined"
			? __DATABASE_URL__
			: process.env.DATABASE_URL,
	ORIGIN: typeof __ORIGIN__ !== "undefined" ? __ORIGIN__ : process.env.ORIGIN,
	COOKIE: typeof __COOKIE__ !== "undefined" ? __COOKIE__ : process.env.COOKIE,
	BETTER_AUTH_SECRET:
		typeof __BETTER_AUTH_SECRET__ !== "undefined"
			? __BETTER_AUTH_SECRET__
			: process.env.BETTER_AUTH_SECRET,
	VERCEL_BLOB:
		typeof __VERCEL_BLOB__ !== "undefined"
			? __VERCEL_BLOB__
			: process.env.VERCEL_BLOB,
	GEOAPIFY:
		typeof __GEOAPIFY__ !== "undefined"
			? __GEOAPIFY__
			: process.env.GEOAPIFY,
	VITE_API:
		typeof __VITE_API__ !== "undefined"
			? __VITE_API__
			: process.env.VITE_API,
});
