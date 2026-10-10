import { z } from "zod";

export const ViteEnvSchema = z
	.looseObject({
		VITE_CONTENT_CDN: z.url(),
		VITE_ORIGIN: z.url("App origin is required (e.g. 'https://example.com')"),
	})
	.strip();

export type ViteEnvSchema = typeof ViteEnvSchema;

export namespace ViteEnvSchema {
	export type Type = z.infer<ViteEnvSchema>;
}
