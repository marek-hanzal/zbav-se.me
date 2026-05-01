import { z } from "zod";

export const AttrEnumSinglePatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().nullable(),
	})
	.strip();

export type AttrEnumSinglePatchSchema = typeof AttrEnumSinglePatchSchema;

export namespace AttrEnumSinglePatchSchema {
	export type Type = z.infer<AttrEnumSinglePatchSchema>;
}
