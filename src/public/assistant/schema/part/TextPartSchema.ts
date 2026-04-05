import { z } from "zod";
import { PartStateEnumSchema } from "./PartStateEnumSchema";
import type { PartTypeEnumSchema } from "./PartTypeEnumSchema";

export const TextPartSchema = z
	.looseObject({
		type: z.literal("text" satisfies PartTypeEnumSchema.Type),
		text: z.string().min(1),
		state: PartStateEnumSchema.optional(),
	})
	.strip();

export type TextPartSchema = typeof TextPartSchema;

export namespace TextPartSchema {
	export type Type = z.infer<TextPartSchema>;
}
