import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";

export const LocationSortSchema = z
	.object({
		value: z.enum([
			"confidence",
			"query",
			"country",
			"address",
		]),
		sort: OrderSchema,
	})
	.openapi("LocationSort", {
		description: "Sort object for location collection",
	});

export type LocationSortSchema = typeof LocationSortSchema;

export namespace LocationSortSchema {
	export type Type = z.infer<LocationSortSchema>;
}
