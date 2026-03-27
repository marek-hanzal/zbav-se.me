import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { ListingFilterSchema } from "~/client/@public/listing/server/schema/ListingFilterSchema";
import { ListingMetaSchema } from "~/client/@public/listing/server/schema/ListingMetaSchema";
import { ListingSortSchema } from "~/client/@public/listing/server/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/client/@public/listing/server/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		filter: ListingFilterSchema.optional(),
		where: ListingWhereSchema.optional().meta({
			id: "PublicListingWhere",
			description: "Public listing filters",
		}),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
	})
	.strip()
	.meta({
		id: "PublicListingQuery",
		description: "Query object for public listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<ListingQuerySchema>;
}
