import { z } from "zod";

export const DraftAttrEnumSingleTableSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type DraftAttrEnumSingleTableSchema = typeof DraftAttrEnumSingleTableSchema;

export namespace DraftAttrEnumSingleTableSchema {
	export type Type = z.infer<DraftAttrEnumSingleTableSchema>;
}
