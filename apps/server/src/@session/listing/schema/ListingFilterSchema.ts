import { z } from "@hono/zod-openapi";
import { CurrencyListSchema } from "../../../schema/CurrencyListSchema";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";
import { PriceSchema } from "../../../schema/PriceSchema";
import { CategoryIdInSchema } from "../../category/schema/CategoryIdInSchema";
import { CategoryIdSchema } from "../../category/schema/CategoryIdSchema";

export const ListingFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		priceMin: PriceSchema({
			type: "PriceMin",
			description: "Sets the minimum price for the listings",
		}).optional(),
		priceMax: PriceSchema({
			type: "PriceMax",
			description: "Sets the maximum price for the listings",
		}).optional(),
		conditionMin: z.number().gte(0).optional().openapi({
			description:
				"This filter matches listings with condition greater than or equal to the provided value",
		}),
		conditionMax: z.number().gte(0).optional().openapi({
			description:
				"This filter matches listings with condition less than or equal to the provided value",
		}),
		conditionIn: z.array(z.number().gte(0)).nullish().openapi({
			description:
				"This filter matches listings with conditions in the provided array",
		}),
		ageMin: z.number().gte(0).optional().openapi({
			description:
				"This filter matches listings with age greater than or equal to the provided value",
		}),
		ageMax: z.number().gte(0).optional().openapi({
			description:
				"This filter matches listings with age less than or equal to the provided value",
		}),
		categoryId: CategoryIdSchema({
			description:
				"This filter matches listings with the exact category ID",
		}).optional(),
		categoryIdIn: CategoryIdInSchema({
			description: "Filter listings based on the provided category IDs",
		}).optional(),
		currency: CurrencyListSchema.optional(),
		currencyIn: z
			.array(CurrencyListSchema)
			.optional()
			.openapi("CurrencyIn", {
				description:
					"This filter matches listings with currency codes in the provided array",
			}),
		expiresAtBefore: z.coerce.date().nullish().openapi({
			description:
				"This filter matches listings that expire before the provided date",
		}),
		expiresAtAfter: z.coerce.date().nullish().openapi({
			description:
				"This filter matches listings that expire after the provided date",
		}),
		rangeMin: z.number().gte(0).nullish().openapi({
			description:
				"This filter matches listings with range greater than or equal to the provided value (meters)",
		}),
		rangeMax: z.number().gte(0).nullish().openapi({
			description:
				"This filter matches listings with range less than or equal to the provided value (meters)",
		}),
		description: z.string().min(1).nullish().openapi({
			description:
				"This filter matches listings with description matching the provided value",
		}),
		tags: z.string().min(1).nullish().openapi({
			description:
				"This filter matches listings with tags matching the provided value",
		}),
	})
	.openapi("ListingFilter", {
		description: "User-land filters",
	});

export type ListingFilterSchema = typeof ListingFilterSchema;

export namespace ListingFilterSchema {
	export type Type = z.infer<ListingFilterSchema>;
}
