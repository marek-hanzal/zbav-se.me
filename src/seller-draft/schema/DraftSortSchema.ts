import { z } from "zod";
import { OrderEnumSchema } from "~/query/schema/OrderEnumSchema";

export const DraftSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
			])
			.meta({
				id: "DraftSortField",
				description: "Field of the draft sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "DraftSort",
		description: "Sort object for draft collection",
	});

export type DraftSortSchema = typeof DraftSortSchema;

export namespace DraftSortSchema {
	export type Type = z.infer<DraftSortSchema>;
}
