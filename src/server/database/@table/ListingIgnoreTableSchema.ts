import { z } from "zod";

export const ListingIgnoreTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the ignore entry",
		}),
		userId: z.string().meta({
			description: "ID of the user who ignored the listing",
		}),
		listingId: z.string().meta({
			description: "ID of the listing that was ignored",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "ListingIgnoreTable",
		description: "Database row for a listing ignore.",
	})
	.strip();

export type ListingIgnoreTableSchema = typeof ListingIgnoreTableSchema;

export namespace ListingIgnoreTableSchema {
	export type Type = z.infer<ListingIgnoreTableSchema>;
}
