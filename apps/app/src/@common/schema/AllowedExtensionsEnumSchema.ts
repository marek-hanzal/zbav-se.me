import { z } from "zod";

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
	.meta({
		id: "AllowedExtensionsEnum",
		description: "Allowed extensions",
	});

export type AllowedExtensionsEnumSchema = typeof AllowedExtensionsEnumSchema;

export namespace AllowedExtensionsEnumSchema {
	export type Type = z.infer<AllowedExtensionsEnumSchema>;
}
