import { z } from "zod";
import { ListingTableSchema } from "~/database/schema/ListingTableSchema";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { CategorySchema } from "~/user-category/schema/CategorySchema";
import { TransactionEntrySchema } from "~/user-transaction-entry/schema/TransactionEntry";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
		category: CategorySchema,
		withTransactionCount: z.coerce.number().int().nonnegative(),
		withUnreadCount: z.coerce.number().int().nonnegative(),
		withTransactionEntry: TransactionEntrySchema.nullable(),
		withLastAt: z.date().nullable(),
		withRestriction: RestrictionEnumSchema.meta({
			description: `
Effective restriction applied on the listing.
            `.trim(),
		}),
	})
	.omit({
		userId: true,
		galleryId: true,
		withLocation: true,
		withTitle: true,
	})
	.strip()
	.meta({
		id: "Listing",
		description: "Listing data",
	});

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<ListingSchema>;
}
