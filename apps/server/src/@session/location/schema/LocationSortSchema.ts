import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const LocationSortSchema = z
	.object({
		field: z
			.enum([
				"confidence",
				"query",
				"country",
				"address",
			])
			.openapi("LocationSortField", {
				description: "Field for location sort",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("LocationSort", {
		description: "Data for location sort",
	});

export type LocationSortSchema = typeof LocationSortSchema;

export namespace LocationSortSchema {
	export type Type = z.infer<LocationSortSchema>;
}
