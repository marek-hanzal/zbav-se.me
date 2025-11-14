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

export const AllowedExtensionsSchema = z.enum(AllowedExtensions).openapi("AllowedExtensions", {
	description: "Allowed extensions",
});

export type AllowedExtensionsSchema = typeof AllowedExtensionsSchema;

export namespace AllowedExtensionsSchema {
	export type Type = z.infer<AllowedExtensionsSchema>;
}
