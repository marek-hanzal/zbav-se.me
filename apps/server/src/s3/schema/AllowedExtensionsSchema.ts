import { z } from "@hono/zod-openapi";

const AllowedExtensions = [
	"webp",
	"png",
	"jpg",
	"jpeg",
	"avif",
	"heic",
	"heif",
] as const;

export const AllowedExtensionsSchema = z
	.enum(AllowedExtensions)
	.openapi("AllowedExtensions", {
		description: "File extension. Must be one of the allowed extensions.",
		example: "webp",
	});

export type AllowedExtensionsSchema = typeof AllowedExtensionsSchema;

export namespace AllowedExtensionsSchema {
	export type Type = z.infer<AllowedExtensionsSchema>;
}
