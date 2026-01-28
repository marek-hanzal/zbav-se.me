import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { ListingQuerySchema } from "./ListingQuerySchema";

export const ListingCountQuerySchema = z
	.looseObject({
		...ListingQuerySchema.pick({
			filter: true,
			where: true,
			meta: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("ListingCountQuery", {
		description: "Query object for listing count",
	});

export type ListingCountQuerySchema = typeof ListingCountQuerySchema;

export namespace ListingCountQuerySchema {
	export type Type = z.infer<ListingCountQuerySchema>;
}
