import { z } from "zod";

export const AttrEnumMultiSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type AttrEnumMultiSchema = typeof AttrEnumMultiSchema;

export namespace AttrEnumMultiSchema {
	export type Type = z.infer<AttrEnumMultiSchema>;
}
