import { z } from "zod";

export const AttrNumberPatchSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.number().int().nullable(),
	})
	.strip();

export type AttrNumberPatchSchema = typeof AttrNumberPatchSchema;

export namespace AttrNumberPatchSchema {
	export type Type = z.infer<AttrNumberPatchSchema>;
}
