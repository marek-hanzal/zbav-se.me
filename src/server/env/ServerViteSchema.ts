import { z } from "zod";

export const ServerViteSchema = z
	.looseObject({
		VITE_ORIGIN: z.url("App origin is required (e.g. 'https://example.com')"),
	})
	.strip();

export type ServerViteSchema = typeof ServerViteSchema;

export namespace ServerViteSchema {
	export type Type = z.infer<ServerViteSchema>;
}
