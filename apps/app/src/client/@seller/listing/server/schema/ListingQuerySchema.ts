import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { ListingFilterSchema } from "~/client/@seller/listing/server/schema/ListingFilterSchema";
import { ListingSortSchema } from "~/client/@seller/listing/server/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/client/@seller/listing/server/schema/ListingWhereSchema";

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
	.meta({
		id: "ListingQuery",
		description: "Query object for listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<ListingQuerySchema>;
}
