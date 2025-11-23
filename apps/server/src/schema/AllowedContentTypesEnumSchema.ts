import { z } from "@hono/zod-openapi";

export const AllowedContentTypesEnumSchema = z
	.enum([
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/avif",
		"image/heic",
		"image/heif",
	])
	.openapi("AllowedContentTypesEnum", {
		description: "Allowed content types",
	});

export type AllowedContentTypesEnumSchema = typeof AllowedContentTypesEnumSchema;

export namespace AllowedContentTypesEnumSchema {
	export type Type = z.infer<AllowedContentTypesEnumSchema>;
}
