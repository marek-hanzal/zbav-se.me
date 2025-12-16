import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const FlagSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("FlagSortField", {
				description: "Field of the flag sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("FlagSort", {
		description: "Sort object for flag collection",
	});

export type FlagSortSchema = typeof FlagSortSchema;

export namespace FlagSortSchema {
	export type Type = z.infer<FlagSortSchema>;
}
