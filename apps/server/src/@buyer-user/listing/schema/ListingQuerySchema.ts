import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { ListingFilterSchema } from "~/@buyer-user/listing/schema/ListingFilterSchema";
import { ListingMetaSchema } from "~/@buyer-user/listing/schema/ListingMetaSchema";
import { ListingSortSchema } from "~/@buyer-user/listing/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/@buyer-user/listing/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		filter: ListingFilterSchema.optional(),
		where: ListingWhereSchema.optional().openapi("ListingWhere", {
			description: "App-based filters",
		}),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
	})
	.strip()
	.openapi("ListingQuery", {
		description: "Query object for listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<ListingQuerySchema>;
}
