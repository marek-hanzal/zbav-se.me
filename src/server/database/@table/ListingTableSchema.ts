import { z } from "zod";
import { CategoryDiscoveryEnumSchema } from "~/common/category/enum/CategoryDiscoveryEnumSchema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export const ListingTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the listing",
		}),
		userId: z.string().meta({
			description: "ID of the user who created the listing",
		}),
		//
		categoryId: z.string().min(1).optional(),
		withCategoryDiscovery: CategoryDiscoveryEnumSchema.optional(),
		withCategoryRestriction: RestrictionEnumSchema.optional(),
		//
		status: ListingStatusEnumSchema,
		//
		galleryId: z.string().min(1),
		withImageUrl: z.array(z.string().min(1)),
		withUploadIds: z.array(z.string().min(1)).meta({
			description:
				"Denormalized ordered upload IDs used for draft gallery management and consistency checks",
		}),
		//
		visibleAt: z.coerce.date().optional().meta({
			description: "When a listing goes live",
		}),
		expiresAt: z.coerce.date().optional().meta({
			description: "When a listing dies",
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
