import { z } from "zod";

export const DraftItemSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the draft",
		}),
	})
	.strip()
	.meta({
		id: "DraftItem",
		description: "Draft collection item",
	});

export type DraftItemSchema = typeof DraftItemSchema;

export namespace DraftItemSchema {
	export type Type = z.infer<DraftItemSchema>;
}
