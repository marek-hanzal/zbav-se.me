import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "~/@buyer-user/listing/schema/ListingFilterSchema";

export const ListingWhereSchema = z
	.object({
		...ListingFilterSchema.shape,
	})
	.openapi("ListingWhere", {
		description: "App-based filters",
	});

export type ListingWhereSchema = typeof ListingWhereSchema;

export namespace ListingWhereSchema {
	export type Type = z.infer<ListingWhereSchema>;
}
