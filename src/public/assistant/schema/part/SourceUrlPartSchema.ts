import { z } from "zod";
import type { PartTypeEnumSchema } from "./PartTypeEnumSchema";

export const SourceUrlPartSchema = z
	.looseObject({
		type: z.literal("source-url" satisfies PartTypeEnumSchema.Type),
		sourceId: z.string().min(1),
		url: z.url(),
		title: z.string().optional(),
	})
	.strip();

export type SourceUrlPartSchema = typeof SourceUrlPartSchema;

export namespace SourceUrlPartSchema {
	export type Type = z.infer<SourceUrlPartSchema>;
}
