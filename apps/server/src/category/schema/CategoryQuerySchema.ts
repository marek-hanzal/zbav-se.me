import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";
import { CursorSchema } from "../../schema/CursorSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

const FilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		name: z.string().nullish().openapi({
			description: "This filter matches the exact name of the category",
		}),
		categoryGroupId: z.string().nullish().openapi({
			description:
				"This filter matches the exact id of the category group the category belongs to",
		}),
		categoryGroupIdIn: z.array(z.string()).nullish().openapi({
			description:
				"This filter matches the ids of the category groups the category belongs to",
		}),
	})
	.openapi("CategoryFilter", {
		description: "User-land filters",
	});

export const CategoryQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FilterSchema.nullish(),
		where: FilterSchema.openapi("CategoryWhere", {
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
			.openapi("CategorySort", {
				description: "Sort object for category collection",
			})
			.array()
			.nullish(),
	})
	.openapi("CategoryQuery", {
		description: "Query object for category collection",
	});

export type CategoryQuerySchema = typeof CategoryQuerySchema;

export namespace CategoryQuerySchema {
	export type Type = z.infer<typeof CategoryQuerySchema>;
}
