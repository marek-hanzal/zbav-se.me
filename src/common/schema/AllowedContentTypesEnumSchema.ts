import { z } from "zod";

export const AllowedContentTypesEnumSchema = z
	.enum([
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/avif",
		"image/heic",
		"image/heif",
	])
	.meta({
		id: "AllowedContentTypesEnum",
		description: "Allowed content types",
	});

export type AllowedContentTypesEnumSchema = typeof AllowedContentTypesEnumSchema;

export namespace AllowedContentTypesEnumSchema {
	export type Type = z.infer<AllowedContentTypesEnumSchema>;
}
