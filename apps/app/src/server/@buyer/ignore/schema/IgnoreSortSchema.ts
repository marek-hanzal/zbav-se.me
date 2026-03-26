import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const IgnoreSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("IgnoreSortField", {
				description: "Field of the ignore sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("IgnoreSort", {
		description: "Sort object for ignore collection",
	});

export type IgnoreSortSchema = typeof IgnoreSortSchema;

export namespace IgnoreSortSchema {
	export type Type = z.infer<IgnoreSortSchema>;
}
