import z from "zod";
import { ServerDatabaseSchema } from "~/schema/ServerDatabaseSchema";
import { ServerOriginSchema } from "~/schema/ServerOriginSchema";
import { ServerS3Schema } from "~/schema/ServerS3Schema";

export const AppEnvSchema = z.object({
	VITE_DOMAIN: z.string().min(1, "Domain is required"),
	VITE_SERVER_API: z.string().min(1, "Server API is required"),
	//
	SERVER_CONTENT_CDN: z.string().min(1, "Content CDN is required"),
	//
	SERVER_BETTER_AUTH_SECRET: z.string().min(1, "Better Auth secret is required"),
	//
	SERVER_JWT_SECRET: z.string().min(1, "JWT secret is required"),
	SERVER_GEOAPIFY_TOKEN: z.string().min(1, "Geoapify API key is required"),
	//
	SERVER_GITHUB: z.string().min(1, "GitHub token is required"),
	//
	...ServerOriginSchema.shape,
	...ServerDatabaseSchema.shape,
	...ServerS3Schema.shape,
});
