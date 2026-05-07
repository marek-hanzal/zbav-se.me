import { z } from "zod";

export const IgnoreCreateSchema = z
	.looseObject({
		listingId: z.string().meta({
			description: "ID of the listing to ignore",
		}),
	})
	.strip()
	.meta({
		id: "IgnoreCreate",
		description: "Data for creating an ignore entry",
	});

export type IgnoreCreateSchema = typeof IgnoreCreateSchema;

export namespace IgnoreCreateSchema {
	export type Type = z.infer<IgnoreCreateSchema>;
}
