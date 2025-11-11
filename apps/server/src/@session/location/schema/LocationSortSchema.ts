import { z } from "@hono/zod-openapi";
import { OrderSchema } from "../../../schema/OrderSchema";

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
		direction: OrderSchema,
	})
	.openapi("LocationSort", {
		description: "Data for location sort",
	});

export type LocationSortSchema = typeof LocationSortSchema;

export namespace LocationSortSchema {
	export type Type = z.infer<LocationSortSchema>;
}
