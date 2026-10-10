import { z } from "zod";

export const DraftAttrEnumSinglePatchSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().nullable(),
	})
	.strip();

export type DraftAttrEnumSinglePatchSchema = typeof DraftAttrEnumSinglePatchSchema;

export namespace DraftAttrEnumSinglePatchSchema {
	export type Type = z.infer<DraftAttrEnumSinglePatchSchema>;
}
