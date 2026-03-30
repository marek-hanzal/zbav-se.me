import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { ListingDeliveryEnumSchema } from "~/common/listing/enum/ListingDeliveryEnumSchema";
import { ListingWarrantyEnumSchema } from "~/common/listing/enum/ListingWarrantyEnumSchema";
import { CurrencyEnumSchema } from "~/common/schema/CurrencyEnumSchema";
import { PriceSchema } from "~/common/schema/PriceSchema";

export const ListingFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		priceMin: PriceSchema({
			id: "PublicPriceMin",
			description: "Sets the minimum price for the listings",
		}).optional(),
		priceMax: PriceSchema({
			id: "PublicPriceMax",
			description: "Sets the maximum price for the listings",
		}).optional(),
		conditionMin: z.number().gte(0).lte(6).optional().meta({
			description:
				"This filter matches listings with condition greater than or equal to the provided value",
		}),
		conditionMax: z.number().gte(0).lte(6).optional().meta({
			description:
				"This filter matches listings with condition less than or equal to the provided value",
		}),
		conditionIn: z.array(z.number().gte(0).lte(6)).optional().meta({
			description: "This filter matches listings with conditions in the provided array",
		}),
		ageMin: z.number().gte(0).lte(6).optional().meta({
			description:
				"This filter matches listings with age greater than or equal to the provided value",
		}),
		ageMax: z.number().gte(0).lte(6).optional().meta({
			description:
				"This filter matches listings with age less than or equal to the provided value",
		}),
		ageIn: z.array(z.number().gte(0).lte(6)).optional().meta({
			description: "This filter matches listings with ages in the provided array",
		}),
		deliveryIn: z.array(ListingDeliveryEnumSchema).optional().meta({
			id: "PublicDeliveryIn",
			description:
				"This filter matches listings with delivery methods overlapping the provided array",
		}),
		warrantyIn: z.array(ListingWarrantyEnumSchema).optional().meta({
			id: "PublicWarrantyIn",
			description: "This filter matches listings with warranty types in the provided array",
		}),
		categoryId: z.string().min(1, "Category ID is required").optional().meta({
			id: "PublicCategoryId",
			description: "ID of the category",
		}),
		categoryIdIn: z
			.array(z.string().min(1, "Category ID is required"))
			.optional()
			.meta({
				id: "PublicCategoryIdIn",
				description: "Filter listings based on the provided category IDs",
			})
			.optional(),
		currency: CurrencyEnumSchema.optional(),
		currencyIn: z.array(CurrencyEnumSchema).optional().meta({
			id: "PublicCurrencyIn",
			description: "This filter matches listings with currency codes in the provided array",
		}),
		expiresAtBefore: z.coerce.date().optional().meta({
			description: "This filter matches listings that expire before the provided date",
			type: "string",
		}),
		expiresAtAfter: z.coerce.date().optional().meta({
			description: "This filter matches listings that expire after the provided date",
			type: "string",
		}),
		range: z.number().gte(0).optional().meta({
			description: "Range (in km) around the input location to filter listings",
		}),
		title: z.string().optional().meta({
			description: "This filter matches listings with title matching the provided value",
		}),
	})
	.strip()
	.meta({
		id: "PublicListingFilter",
		description: "Public listing filters",
	});

export type ListingFilterSchema = typeof ListingFilterSchema;

export namespace ListingFilterSchema {
	export type Type = z.infer<ListingFilterSchema>;
}
