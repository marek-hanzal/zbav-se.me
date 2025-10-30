import { z } from "@hono/zod-openapi";
import { CurrencyListSchema } from "../../schema/CurrencyListSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

export const ListingFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		priceMin: z.number().nullish().openapi({
			description:
				"This filter matches listings with price greater than or equal to the provided value",
		}),
		priceMax: z.number().nullish().openapi({
			description:
				"This filter matches listings with price less than or equal to the provided value",
		}),
		conditionMin: z.number().nullish().openapi({
			description:
				"This filter matches listings with condition greater than or equal to the provided value",
		}),
		conditionMax: z.number().nullish().openapi({
			description:
				"This filter matches listings with condition less than or equal to the provided value",
		}),
		conditionIn: z.array(z.number()).nullish().openapi({
			description:
				"This filter matches listings with conditions in the provided array",
		}),
		ageMin: z.number().nullish().openapi({
			description:
				"This filter matches listings with age greater than or equal to the provided value",
		}),
		ageMax: z.number().nullish().openapi({
			description:
				"This filter matches listings with age less than or equal to the provided value",
		}),
		locationId: z.string().nullish().openapi({
			description:
				"This filter matches listings with the exact location ID",
		}),
		locationIdIn: z.array(z.string()).nullish().openapi({
			description:
				"This filter matches listings with location IDs in the provided array",
		}),
		categoryId: z.string().nullish().openapi({
			description:
				"This filter matches listings with the exact category ID",
		}),
		categoryIdIn: z.array(z.string()).nullish().openapi({
			description:
				"This filter matches listings with category IDs in the provided array",
		}),
		currency: CurrencyListSchema.nullish().openapi({
			description:
				"This filter matches listings with the exact currency code",
		}),
		currencyIn: z.array(CurrencyListSchema).nullish().openapi({
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
		rangeMin: z.number().nullish().openapi({
			description:
				"This filter matches listings with range greater than or equal to the provided value (meters)",
		}),
		rangeMax: z.number().nullish().openapi({
			description:
				"This filter matches listings with range less than or equal to the provided value (meters)",
		}),
		vendor: z.string().nullish().openapi({
			description:
				"This filter matches listings with vendor matching the provided value",
		}),
		model: z.string().nullish().openapi({
			description:
				"This filter matches listings with model matching the provided value",
		}),
	})
	.openapi("ListingFilter", {
		description: "User-land filters",
	});

export type ListingFilterSchema = typeof ListingFilterSchema;

export namespace ListingFilterSchema {
	export type Type = z.infer<ListingFilterSchema>;
}
