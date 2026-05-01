import { z } from "zod";

export const ListingCreateSchema = z
	.looseObject({
		//
	})
	// .strip()
	.meta({
		id: "ListingCreate",
		description: "Data for creating a new listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<ListingCreateSchema>;
}
