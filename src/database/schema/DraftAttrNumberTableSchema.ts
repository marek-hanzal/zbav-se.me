import { z } from "zod";

export const DraftAttrNumberTableSchema = z
	.looseObject({
		draftId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.coerce.number().int(),
	})
	.strip();

export type DraftAttrNumberTableSchema = typeof DraftAttrNumberTableSchema;

export namespace DraftAttrNumberTableSchema {
	export type Type = z.infer<DraftAttrNumberTableSchema>;
}
