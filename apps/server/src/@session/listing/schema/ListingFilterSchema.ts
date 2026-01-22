import { z } from "@hono/zod-openapi";
import { CurrencyListEnumSchema } from "~/schema/CurrencyListEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";
import { PriceSchema } from "~/schema/PriceSchema";
import { ListingDeliveryEnumSchema } from "./ListingDeliveryEnumSchema";
import { ListingWarrantyEnumSchema } from "./ListingWarrantyEnumSchema";

export const ListingFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "ID of the user; does not have an effect on API endpoints",
		}),
		priceMin: PriceSchema({
			type: "PriceMin",
			description: "Sets the minimum price for the listings",
		}).optional(),
		priceMax: PriceSchema({
			type: "PriceMax",
			description: "Sets the maximum price for the listings",
		}).optional(),
		conditionMin: z.number().gte(0).lte(6).optional().openapi({
			description:
				"This filter matches listings with condition greater than or equal to the provided value",
		}),
		conditionMax: z.number().gte(0).lte(6).optional().openapi({
			description:
				"This filter matches listings with condition less than or equal to the provided value",
		}),
		conditionIn: z.array(z.number().gte(0).lte(6)).optional().openapi({
			description: "This filter matches listings with conditions in the provided array",
		}),
		ageMin: z.number().gte(0).lte(6).optional().openapi({
			description:
				"This filter matches listings with age greater than or equal to the provided value",
		}),
		ageMax: z.number().gte(0).lte(6).optional().openapi({
			description:
				"This filter matches listings with age less than or equal to the provided value",
		}),
		ageIn: z.array(z.number().gte(0).lte(6)).optional().openapi({
			description: "This filter matches listings with ages in the provided array",
		}),
		deliveryIn: z.array(ListingDeliveryEnumSchema).optional().openapi("DeliveryIn", {
			description:
				"This filter matches listings with delivery methods overlapping the provided array",
		}),
		warrantyIn: z.array(ListingWarrantyEnumSchema).optional().openapi("WarrantyIn", {
			description: "This filter matches listings with warranty types in the provided array",
		}),
		categoryId: z.string().min(1, "Category ID is required").optional().openapi("CategoryId", {
			description: "ID of the category",
		}),
		categoryIdIn: z
			.array(z.string().min(1, "Category ID is required"))
			.optional()
			.openapi("CategoryIdIn", {
				description: "Filter listings based on the provided category IDs",
			})
			.optional(),
		currency: CurrencyListEnumSchema.optional(),
		currencyIn: z.array(CurrencyListEnumSchema).optional().openapi("CurrencyIn", {
			description: "This filter matches listings with currency codes in the provided array",
		}),
		expiresAtBefore: z.coerce.date().optional().openapi({
			description: "This filter matches listings that expire before the provided date",
			type: "string",
		}),
		expiresAtAfter: z.coerce.date().optional().openapi({
			description: "This filter matches listings that expire after the provided date",
			type: "string",
		}),
		range: z.number().gte(0).optional().openapi({
			description: "Range (in km) around the input location to filter listings",
		}),
		title: z.string().optional().openapi({
			description: "This filter matches listings with title matching the provided value",
		}),
		//
		withOwn: z.boolean().optional().openapi({
			description: "This filter matches listings with the user's own listings",
		}),
		my: z.boolean().optional().openapi({
			description: "Return exclusively user's listings when set to true",
		}),
		withIgnored: z.boolean().optional().openapi({
			description: "Include ignored listings",
		}),
		isFavourite: z.boolean().optional().openapi({
			description: "Show listing that are in the user's favourites",
		}),
		feedId: z.string().min(1, "Feed ID is required").optional().openapi("FeedId", {
			description: "ID of the feed",
		}),
		feedIdIn: z.array(z.string().min(1, "Feed ID is required")).optional().openapi("FeedIdIn", {
			description: "Filter listings based on the provided feed IDs",
		}),
		//
		transaction: z.boolean().optional().openapi({
			description: "Show listings that are in the user's transaction",
		}),
	})
	.openapi("ListingFilter", {
		description: "User-land filters",
	});

export type ListingFilterSchema = typeof ListingFilterSchema;

export namespace ListingFilterSchema {
	export type Type = z.infer<ListingFilterSchema>;
}
