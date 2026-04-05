import { z } from "zod";
import type { PartTypeEnumSchema } from "./PartTypeEnumSchema";

export const SourceDocumentPartSchema = z
	.looseObject({
		type: z.literal("source-document" satisfies PartTypeEnumSchema.Type),
		sourceId: z.string().min(1),
		mediaType: z.string().min(1),
		title: z.string().min(1),
		filename: z.string().optional(),
	})
	.strip();

export type SourceDocumentPartSchema = typeof SourceDocumentPartSchema;

export namespace SourceDocumentPartSchema {
	export type Type = z.infer<SourceDocumentPartSchema>;
}
