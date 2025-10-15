import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";
import { CursorSchema } from "../../schema/CursorSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

const FilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		name: z.string().nullish().openapi({
			description:
				"This filter matches the exact name of the category group",
		}),
		locale: z.string().nullish().openapi({
			description:
				"This filter matches the exact locale of the category group",
		}),
		localeIn: z.array(z.string()).nullish().openapi({
			description:
				"This filter matches category groups with locales in the provided array",
		}),
	})
	.openapi("CategoryGroupFilter", {
		description: "User-land filters",
	});

export const CategoryGroupQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FilterSchema.nullish(),
		where: FilterSchema.openapi("CategoryGroupWhere", {
			description: "App-based filters",
		}).nullish(),
		sort: z
			.object({
				value: z.enum([
					"name",
					"sort",
				]),
				sort: OrderSchema,
			})
			.openapi("CategoryGroupSort", {
				description: "Sort object for category group collection",
			})
			.array()
			.nullish(),
	})
	.openapi("CategoryGroupQuery", {
		description: "Query object for category group collection",
	});

export type CategoryGroupQuerySchema = typeof CategoryGroupQuerySchema;

export namespace CategoryGroupQuerySchema {
	export type Type = z.infer<typeof CategoryGroupQuerySchema>;
}
