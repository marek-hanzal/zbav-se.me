import { z } from "zod";

export const ListingCreateSchema = z
	.looseObject({
		draftId: z.string().min(1),
	})
	.strip()
	.meta({
		id: "ListingCreate",
		description: "Data for publishing a draft into a listing",
	});

export type ListingCreateSchema = typeof ListingCreateSchema;

export namespace ListingCreateSchema {
	export type Type = z.infer<ListingCreateSchema>;
}
