import { z } from "@hono/zod-openapi";

export const AllowedExtensionsEnumSchema = z
	.enum([
		"webp",
		"png",
		"jpg",
		"jpeg",
		"avif",
		"heic",
		"heif",
	])
	.openapi("AllowedExtensionsEnum", {
		description: "Allowed extensions",
	});

export type AllowedExtensionsEnumSchema = typeof AllowedExtensionsEnumSchema;

export namespace AllowedExtensionsEnumSchema {
	export type Type = z.infer<AllowedExtensionsEnumSchema>;
}
