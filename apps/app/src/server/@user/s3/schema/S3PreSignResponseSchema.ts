import { z } from "zod";

export const S3PreSignResponseSchema = z
	.looseObject({
		url: z.url().meta({
			example:
				"https://s3.eu-central-003.backblazeb2.com/...?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
		}),
		cdn: z.string().meta({
			example:
				"https://content.zbav-se.me/123e4567-e89b-12d3-a456-426614174000/listing/abc/photo.webp",
			description: "CDN url where the file lives",
		}),
	})
	.strip()
	.meta({
		id: "S3PreSignResponse",
		description: "Response payload for a presigned S3 upload URL",
	});

export type S3PreSignResponseSchema = typeof S3PreSignResponseSchema;

export namespace S3PreSignResponseSchema {
	export type Type = z.infer<S3PreSignResponseSchema>;
}
