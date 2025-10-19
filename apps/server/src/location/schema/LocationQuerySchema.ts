import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";
import { CursorSchema } from "../../schema/CursorSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

const FilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		query: z.string().nullish().openapi({
			description:
				"This filter matches the exact query that was used to get the location",
		}),
		lang: z.string().nullish().openapi({
			description:
				"This filter matches the exact language that was used to get the location",
		}),
		country: z.string().nullish().openapi({
			description:
				"This filter matches the exact country of the location",
		}),
		code: z.string().nullish().openapi({
			description:
				"This filter matches the exact country code of the location",
		}),
		confidenceMin: z.number().nullish().openapi({
			description:
				"This filter matches locations with confidence greater than or equal to the provided value",
		}),
	})
	.openapi("LocationFilter", {
		description: "User-land filters",
	});

export const LocationQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FilterSchema.nullish(),
		where: FilterSchema.openapi("LocationWhere", {
			description: "App-based filters",
		}).nullish(),
		sort: z
			.object({
				value: z.enum([
					"confidence",
					"query",
					"country",
					"address",
				]),
				sort: OrderSchema,
			})
			.openapi("LocationSort", {
				description: "Sort object for location collection",
			})
			.array()
			.nullish(),
	})
	.openapi("LocationQuery", {
		description: "Query object for location collection",
	});

export type LocationQuerySchema = typeof LocationQuerySchema;

export namespace LocationQuerySchema {
	export type Type = z.infer<typeof LocationQuerySchema>;
}
