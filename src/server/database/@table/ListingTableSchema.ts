import { z } from "zod";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { ProsConsSchema } from "~/common/listing/schema/ProsConsSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { VectorSchema } from "~/common/schema/VectorSchema";

export const ListingTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the listing",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the listing",
		}),
		//
		price: z.coerce.number().meta({
			description: "Price of the listing",
			type: "number",
		}),
		priceType: ListingPriceEnumSchema,
		//
		currency: CurrencyEnumSchema,
		//
		condition: z.number().nullable().meta({
			description: "Condition of the item (0-based index)",
		}),
		//
		age: z.number().nullable().meta({
			description: "Age of the item (0-based index)",
		}),
		//
		delivery: z.array(ListingDeliveryEnumSchema).nullable(),
		//
		warranty: ListingWarrantyEnumSchema.nullable(),
		//
		status: ListingStatusEnumSchema,
		//
		restriction: RestrictionEnumSchema.nullish(),
		//
		locationId: z.string().meta({
			description: "ID of the location",
		}),
		categoryId: z.string().meta({
			description: "ID of the category",
		}),
		galleryId: z.string().meta({
			description: "ID of the gallery",
		}),
		draftId: z.string().nullable().meta({
			description: "ID of the draft this listing was created from",
		}),
		expiresAt: z.coerce.date().meta({
			description: "Expiration timestamp",
		}),
		//
		title: z.string().meta({
			description: "Title of the item",
		}),
		titleVec: VectorSchema.meta({
			description: "Embedding vector for title similarity search",
		}),
		//
		description: z.string().nullable().meta({
			description: "Description of the item",
		}),
		//
		pros: ProsConsSchema.nullable().meta({
			description: "Pros of the item",
		}),
		cons: ProsConsSchema.nullable().meta({
			description: "Cons of the item",
		}),
		//
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
		}),
		updatedAt: z.coerce.date().meta({
			description: "Last update timestamp",
		}),
	})
	.meta({
		id: "ListingTable",
		description: "Database row for a listing.",
	})
	.strip();

export type ListingTableSchema = typeof ListingTableSchema;

export namespace ListingTableSchema {
	export type Type = z.infer<ListingTableSchema>;
}
