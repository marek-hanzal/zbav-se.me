import { z } from "zod";

export const DraftAttrDecimalPatchSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.number().nullable(),
	})
	.strip();

export type DraftAttrDecimalPatchSchema = typeof DraftAttrDecimalPatchSchema;

export namespace DraftAttrDecimalPatchSchema {
	export type Type = z.infer<DraftAttrDecimalPatchSchema>;
}
