import { z } from "zod";

export const AttrDecimalTableSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.coerce.number(),
	})
	.strip();

export type AttrDecimalTableSchema = typeof AttrDecimalTableSchema;

export namespace AttrDecimalTableSchema {
	export type Type = z.infer<AttrDecimalTableSchema>;
}
