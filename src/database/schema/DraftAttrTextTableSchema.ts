import { z } from "zod";

export const DraftAttrTextTableSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type DraftAttrTextTableSchema = typeof DraftAttrTextTableSchema;

export namespace DraftAttrTextTableSchema {
	export type Type = z.infer<DraftAttrTextTableSchema>;
}
