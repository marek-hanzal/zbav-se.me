import { z } from "zod";
import { CursorSchema } from "~/query/schema/CursorSchema";
import { ListingSortSchema } from "~/seller-listing/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/seller-listing/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		where: ListingWhereSchema.optional(),
		sort: ListingSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "ListingQuery",
		description: "Query object for listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<ListingQuerySchema>;
}
