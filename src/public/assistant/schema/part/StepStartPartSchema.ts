import { z } from "zod";
import type { PartTypeEnumSchema } from "./PartTypeEnumSchema";

export const StepStartPartSchema = z
	.looseObject({
		type: z.literal("step-start" satisfies PartTypeEnumSchema.Type),
	})
	.strip();

export type StepStartPartSchema = typeof StepStartPartSchema;

export namespace StepStartPartSchema {
	export type Type = z.infer<StepStartPartSchema>;
}
