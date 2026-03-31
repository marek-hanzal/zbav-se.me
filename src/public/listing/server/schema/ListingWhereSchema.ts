import { z } from "zod";
import { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";

export const ListingWhereSchema = z
	.looseObject({
		...ListingFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicListingWhere",
		description: "Public listing filters",
	});

export type ListingWhereSchema = typeof ListingWhereSchema;

export namespace ListingWhereSchema {
	export type Type = z.infer<ListingWhereSchema>;
}
