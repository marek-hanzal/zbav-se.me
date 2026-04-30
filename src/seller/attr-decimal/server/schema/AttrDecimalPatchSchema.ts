import { z } from "zod";

export const AttrDecimalPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.number().nullable(),
	})
	.strip();

export type AttrDecimalPatchSchema = typeof AttrDecimalPatchSchema;

export namespace AttrDecimalPatchSchema {
	export type Type = z.infer<AttrDecimalPatchSchema>;
}
