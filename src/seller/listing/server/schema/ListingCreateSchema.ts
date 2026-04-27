import { z } from "zod";
import { TitleSchema } from "~/common/listing/schema/TitleSchema";

export const ListingCreateSchema = z
	.looseObject({
		title: TitleSchema,
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
