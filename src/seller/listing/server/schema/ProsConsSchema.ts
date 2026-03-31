import { z } from "zod";

export const ProsConsSchema = z
	.array(z.string().max(72))
	.max(5)
	.meta({
		id: "ProsCons",
		type: "array",
		items: {
			type: "string",
			maxLength: 72,
		},
		maxItems: 5,
		description: "Array of pros or cons, max 5 items, each string max 72 characters",
	});

export type ProsConsSchema = typeof ProsConsSchema;

export namespace ProsConsSchema {
	export type Type = z.infer<ProsConsSchema>;
}
