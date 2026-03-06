import { z } from "@hono/zod-openapi";

export const S3PreSignMcpOutputSchema = z
	.object({
		url: z
			.url()
			.describe(
				"Short-lived pre-signed PUT URL. Upload the file bytes directly to this URL.",
			),
		cdn: z
			.string()
			.describe(
				"CDN URL that will serve the uploaded file after the PUT succeeds. Pass this URL into user.uploadCreate to obtain an upload id.",
			),
	})
	.describe("Pre-signed S3 upload target and resulting CDN URL for direct image upload.");

export type S3PreSignMcpOutputSchema = typeof S3PreSignMcpOutputSchema;

export namespace S3PreSignMcpOutputSchema {
	export type Type = z.infer<S3PreSignMcpOutputSchema>;
}
