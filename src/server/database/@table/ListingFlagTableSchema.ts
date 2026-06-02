import { z } from "zod";

export const ListingFlagTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the flag entry",
		}),
		userId: z.string().meta({
			description: "ID of the user who flagged the listing",
		}),
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "ListingFlagTable",
		description: "Database row for a listing flag.",
	})
	.strip();

export type ListingFlagTableSchema = typeof ListingFlagTableSchema;

export namespace ListingFlagTableSchema {
	export type Type = z.infer<ListingFlagTableSchema>;
}
