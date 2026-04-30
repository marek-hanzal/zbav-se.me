import { z } from "zod";

export const AttrTextPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().nullable(),
	})
	.strip();

export type AttrTextPatchSchema = typeof AttrTextPatchSchema;

export namespace AttrTextPatchSchema {
	export type Type = z.infer<AttrTextPatchSchema>;
}
