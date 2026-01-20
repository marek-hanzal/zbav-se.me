import z from "zod";

export const ServerViteSchema = z
	.looseObject({
		VITE_DOMAIN: z.string().min(1, "Domain is required"),
		VITE_WEB_ORIGIN: z
			.string()
			.min(1, "Web domain ORIGIN is required (used for CORS and auth)"),
		VITE_APP_ORIGIN: z
			.string()
			.min(1, "App domain ORIGIN is required (used for CORS and auth)"),
		VITE_SERVER_API: z.url(),
	})
	.strip();

export type ServerViteSchema = typeof ServerViteSchema;

export namespace ServerViteSchema {
	export type Type = z.infer<ServerViteSchema>;
}
