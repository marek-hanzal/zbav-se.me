import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";
import { CursorSchema } from "../../schema/CursorSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

const FilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		category: z.string().nullish().openapi({
			description:
				"This filter matches the exact category name that was missed",
		}),
	})
	.openapi("CategoryMissFilter", {
		description: "User-land filters for category miss tracking",
	});

export const CategoryMissQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FilterSchema.nullish(),
		where: FilterSchema.openapi("CategoryMissWhere", {
			description: "App-based filters for category miss tracking",
		}).nullish(),
		sort: z
			.object({
				value: z.enum([
					"category",
					"count",
					"updatedAt",
				]),
				sort: OrderSchema,
			})
			.openapi("CategoryMissSort", {
				description: "Sort object for category miss collection",
			})
			.array()
			.nullish(),
	})
	.openapi("CategoryMissQuery", {
		description: "Query object for category miss collection",
	});

export type CategoryMissQuerySchema = typeof CategoryMissQuerySchema;

export namespace CategoryMissQuerySchema {
	export type Type = z.infer<typeof CategoryMissQuerySchema>;
}
