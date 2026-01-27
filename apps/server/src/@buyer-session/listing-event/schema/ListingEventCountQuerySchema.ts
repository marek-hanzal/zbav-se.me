import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { ListingEventQuerySchema } from "./ListingEventQuerySchema";

export const ListingEventCountQuerySchema = z
	.looseObject({
		...ListingEventQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("ListingEventCountQuery", {
		description: "Query object for listing event count",
	});

export type ListingEventCountQuerySchema = typeof ListingEventCountQuerySchema;

export namespace ListingEventCountQuerySchema {
	export type Type = z.infer<ListingEventCountQuerySchema>;
}
