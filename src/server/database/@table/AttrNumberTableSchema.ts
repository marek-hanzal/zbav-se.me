import { z } from "zod";

export const AttrNumberTableSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.coerce.number().int(),
	})
	.strip();

export type AttrNumberTableSchema = typeof AttrNumberTableSchema;

export namespace AttrNumberTableSchema {
	export type Type = z.infer<AttrNumberTableSchema>;
}
