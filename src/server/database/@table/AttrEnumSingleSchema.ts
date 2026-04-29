import { z } from "zod";

export const AttrEnumSingleSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type AttrEnumSingleSchema = typeof AttrEnumSingleSchema;

export namespace AttrEnumSingleSchema {
	export type Type = z.infer<AttrEnumSingleSchema>;
}
