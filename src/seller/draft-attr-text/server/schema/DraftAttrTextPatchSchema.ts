import { z } from "zod";

export const DraftAttrTextPatchSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().nullable(),
	})
	.strip();

export type DraftAttrTextPatchSchema = typeof DraftAttrTextPatchSchema;

export namespace DraftAttrTextPatchSchema {
	export type Type = z.infer<DraftAttrTextPatchSchema>;
}
