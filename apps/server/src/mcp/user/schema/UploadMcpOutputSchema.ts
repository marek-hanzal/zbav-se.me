import { z } from "@hono/zod-openapi";

export const UploadMcpOutputSchema = z
	.object({
		id: z
			.string()
			.describe(
				"Stable upload id. Preserve this id and pass it into draft gallery or listing creation flows.",
			),
		url: z
			.url()
			.describe(
				"CDN URL of the uploaded file. This is the URL that was accepted into upload metadata.",
			),
	})
	.describe("Registered upload metadata used by draft galleries and listing galleries.");

export type UploadMcpOutputSchema = typeof UploadMcpOutputSchema;

export namespace UploadMcpOutputSchema {
	export type Type = z.infer<UploadMcpOutputSchema>;
}
