import { z } from "zod";

export const DraftAttrDecimalTableSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.coerce.number(),
	})
	.strip();

export type DraftAttrDecimalTableSchema = typeof DraftAttrDecimalTableSchema;

export namespace DraftAttrDecimalTableSchema {
	export type Type = z.infer<DraftAttrDecimalTableSchema>;
}
