import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const DraftSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
				"updatedAt",
			])
			.openapi("DraftSortField", {
				description: "Field of the draft sort",
			}),
		order: OrderEnumSchema,
	})
	.openapi("DraftSort", {
		description: "Sort object for draft collection",
	});

export type DraftSortSchema = typeof DraftSortSchema;

export namespace DraftSortSchema {
	export type Type = z.infer<DraftSortSchema>;
}
