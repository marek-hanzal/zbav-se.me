import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { ListingSortSchema } from "~/buyer/listing/server/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/buyer/listing/server/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		filter: ListingFilterSchema.optional(),
		where: ListingWhereSchema.optional().meta({
			id: "ListingWhere",
			description: "App-based filters",
		}),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
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
