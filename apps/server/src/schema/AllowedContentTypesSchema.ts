import { z } from "@hono/zod-openapi";

const AllowedContentTypes = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif",
	"image/heic",
	"image/heif",
] as const;

export const AllowedContentTypesSchema = z
	.enum(AllowedContentTypes)
	.openapi("AllowedContentTypes", {
		description: "Browser-provided Content-Type used for PUT upload.",
		example: "image/webp",
	});

export type AllowedContentTypesSchema = typeof AllowedContentTypesSchema;

export namespace AllowedContentTypesSchema {
	export type Type = z.infer<AllowedContentTypesSchema>;
}
