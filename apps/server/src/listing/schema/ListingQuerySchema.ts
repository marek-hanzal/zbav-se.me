import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";
import { CursorSchema } from "../../schema/CursorSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

const FilterSchema = z
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
		categoryGroupId: z.string().nullish().openapi({
			description:
				"This filter matches listings with the exact category group ID",
		}),
		categoryGroupIdIn: z.array(z.string()).nullish().openapi({
			description:
				"This filter matches listings with category group IDs in the provided array",
		}),
		categoryId: z.string().nullish().openapi({
			description:
				"This filter matches listings with the exact category ID",
		}),
		categoryIdIn: z.array(z.string()).nullish().openapi({
			description:
				"This filter matches listings with category IDs in the provided array",
		}),
	})
	.openapi("ListingFilter", {
		description: "User-land filters",
	});

export const ListingQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FilterSchema.nullish(),
		where: FilterSchema.openapi("ListingWhere", {
			description: "App-based filters",
		}).nullish(),
		sort: z
			.object({
				value: z.enum([
					"price",
					"condition",
					"age",
					"createdAt",
					"updatedAt",
				]),
				sort: OrderSchema,
			})
			.openapi("ListingSort", {
				description: "Sort object for listing collection",
			})
			.array()
			.nullish(),
	})
	.openapi("ListingQuery", {
		description: "Query object for listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<typeof ListingQuerySchema>;
}
