import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const LocationSortSchema = z
	.looseObject({
		field: z
			.enum([
				"confidence",
				"query",
				"country",
				"address",
			])
			.meta({
				id: "LocationSortField",
				description: "Field for location sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "LocationSort",
		description: "Data for location sort",
	});

export type LocationSortSchema = typeof LocationSortSchema;

export namespace LocationSortSchema {
	export type Type = z.infer<LocationSortSchema>;
}
