import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { ListingFilterSchema } from "~/server/@seller/listing/schema/ListingFilterSchema";
import { ListingSortSchema } from "~/server/@seller/listing/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/server/@seller/listing/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		filter: ListingFilterSchema.optional(),
		where: ListingWhereSchema.optional(),
		sort: ListingSortSchema.array().optional(),
	})
	.strip()
	.openapi("ListingQuery", {
		description: "Query object for listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<ListingQuerySchema>;
}
