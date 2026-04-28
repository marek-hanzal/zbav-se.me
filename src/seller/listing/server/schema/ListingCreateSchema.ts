import { z } from "zod";

export const ListingCreateSchema = z
	.looseObject({
		categoryId: z.string().min(1),
	})
	.strip()
	.meta({
		id: "ListingCreate",
		description: "Data for creating a new listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<ListingCreateSchema>;
}
