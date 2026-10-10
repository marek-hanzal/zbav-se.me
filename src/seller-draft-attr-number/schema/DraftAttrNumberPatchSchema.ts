import { z } from "zod";

export const DraftAttrNumberPatchSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.number().int().nullable(),
	})
	.strip();

export type DraftAttrNumberPatchSchema = typeof DraftAttrNumberPatchSchema;

export namespace DraftAttrNumberPatchSchema {
	export type Type = z.infer<DraftAttrNumberPatchSchema>;
}
