import { z } from "zod";

export const DraftAttrEnumMultiPatchSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.array(z.string()),
	})
	.strip();

export type DraftAttrEnumMultiPatchSchema = typeof DraftAttrEnumMultiPatchSchema;

export namespace DraftAttrEnumMultiPatchSchema {
	export type Type = z.infer<DraftAttrEnumMultiPatchSchema>;
}
