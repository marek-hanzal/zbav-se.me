import { z } from "zod";

export const AttrTextSchema = z
	.looseObject({
		listingId: z.string().min(1),
		fieldId: z.string().min(1),
		value: z.string().min(1),
	})
	.strip();

export type AttrTextSchema = typeof AttrTextSchema;

export namespace AttrTextSchema {
	export type Type = z.infer<AttrTextSchema>;
}
