import { z } from "zod";
import type { PartTypeEnumSchema } from "./PartTypeEnumSchema";

export const FilePartSchema = z
	.looseObject({
		type: z.literal("file" satisfies PartTypeEnumSchema.Type),
		mediaType: z.string().min(1),
		filename: z.string().optional(),
		url: z.url(),
	})
	.strip();

export type FilePartSchema = typeof FilePartSchema;

export namespace FilePartSchema {
	export type Type = z.infer<FilePartSchema>;
}
