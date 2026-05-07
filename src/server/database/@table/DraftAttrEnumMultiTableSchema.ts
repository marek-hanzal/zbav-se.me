import { z } from "zod";

export const DraftAttrEnumMultiTableSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type DraftAttrEnumMultiTableSchema = typeof DraftAttrEnumMultiTableSchema;

export namespace DraftAttrEnumMultiTableSchema {
	export type Type = z.infer<DraftAttrEnumMultiTableSchema>;
}
