import { z } from "@hono/zod-openapi";
import { ListingQuerySchema } from "~/@buyer-user/listing/schema/ListingQuerySchema";

export const ListingCountQuerySchema = z
	.looseObject({
		...ListingQuerySchema.pick({
			filter: true,
			where: true,
			meta: true,
		}).shape,
	})
	.strip()
	.openapi("ListingCountQuery", {
		description: "Query object for listing count",
	});

export type ListingCountQuerySchema = typeof ListingCountQuerySchema;

export namespace ListingCountQuerySchema {
	export type Type = z.infer<ListingCountQuerySchema>;
}
