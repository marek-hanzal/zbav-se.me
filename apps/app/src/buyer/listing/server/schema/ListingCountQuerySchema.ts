import { z } from "zod";
import { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";

export const ListingCountQuerySchema = z
	.looseObject({
		...ListingQuerySchema.pick({
			filter: true,
			where: true,
			meta: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "ListingCountQuery",
		description: "Query object for listing count",
	});

export type ListingCountQuerySchema = typeof ListingCountQuerySchema;

export namespace ListingCountQuerySchema {
	export type Type = z.infer<ListingCountQuerySchema>;
}
