import { z } from "@hono/zod-openapi";

export const S3PreSignMcpInputSchema = z
	.object({
		path: z
			.string()
			.min(3)
			.describe(
				"Logical upload path inside the current user namespace, for example listings/draft-images/cover. Do not include the user id prefix because the server adds it.",
			),
		extension: z
			.enum([
				"webp",
				"png",
				"jpg",
				"jpeg",
				"avif",
				"heic",
				"heif",
			])
			.describe(
				"File extension for the object key. Use values from zbav://mcp/schema/enum/allowed-extension.",
			),
		contentType: z
			.enum([
				"image/jpeg",
				"image/png",
				"image/webp",
				"image/avif",
				"image/heic",
				"image/heif",
			])
			.describe(
				"Content type that matches the binary file being uploaded. Use values from zbav://mcp/schema/enum/allowed-content-type.",
			),
	})
	.describe("User S3 pre-sign request for direct image upload into the private bucket.");

export type S3PreSignMcpInputSchema = typeof S3PreSignMcpInputSchema;

export namespace S3PreSignMcpInputSchema {
	export type Type = z.infer<S3PreSignMcpInputSchema>;
}
