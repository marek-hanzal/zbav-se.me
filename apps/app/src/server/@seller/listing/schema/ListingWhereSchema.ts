import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "~/server/@seller/listing/schema/ListingFilterSchema";

export const ListingWhereSchema = z
	.looseObject({
		...ListingFilterSchema.shape,
	})
	.strip()
	.openapi("ListingWhere", {
		description: "App-based filters",
	});

export type ListingWhereSchema = typeof ListingWhereSchema;

export namespace ListingWhereSchema {
	export type Type = z.infer<ListingWhereSchema>;
}
