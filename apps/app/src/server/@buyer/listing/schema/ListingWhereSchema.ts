import { z } from "zod";
import { ListingFilterSchema } from "~/server/@buyer/listing/schema/ListingFilterSchema";

export const ListingWhereSchema = z
	.looseObject({
		...ListingFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "ListingWhere",
		description: "App-based filters",
	});

export type ListingWhereSchema = typeof ListingWhereSchema;

export namespace ListingWhereSchema {
	export type Type = z.infer<ListingWhereSchema>;
}
