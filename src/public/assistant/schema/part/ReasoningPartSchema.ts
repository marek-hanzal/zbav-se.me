import { z } from "zod";
import { PartStateEnumSchema } from "./PartStateEnumSchema";
import type { PartTypeEnumSchema } from "./PartTypeEnumSchema";

export const ReasoningPartSchema = z
	.looseObject({
		type: z.literal("reasoning" satisfies PartTypeEnumSchema.Type),
		text: z.string(),
		state: PartStateEnumSchema.optional(),
	})
	.strip();

export type ReasoningPartSchema = typeof ReasoningPartSchema;

export namespace ReasoningPartSchema {
	export type Type = z.infer<ReasoningPartSchema>;
}
