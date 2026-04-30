import { z } from "zod";

export const AttrEnumMultiPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.array(z.string()),
	})
	.strip();

export type AttrEnumMultiPatchSchema = typeof AttrEnumMultiPatchSchema;

export namespace AttrEnumMultiPatchSchema {
	export type Type = z.infer<AttrEnumMultiPatchSchema>;
}
