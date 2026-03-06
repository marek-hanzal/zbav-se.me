import { z } from "@hono/zod-openapi";

export const UploadCreateMcpInputSchema = z
	.object({
		url: z
			.url()
			.describe(
				"CDN URL of an already uploaded file. This must be the CDN URL returned by user.s3PreSign after the binary PUT upload succeeded.",
			),
	})
	.describe(
		"Register an uploaded file in application metadata so galleries can reference it by upload id.",
	);

export type UploadCreateMcpInputSchema = typeof UploadCreateMcpInputSchema;

export namespace UploadCreateMcpInputSchema {
	export type Type = z.infer<UploadCreateMcpInputSchema>;
}
