import { z } from "zod";
import { ListingMetaSchema } from "~/buyer-listing/schema/ListingMetaSchema";
import { ListingSortSchema } from "~/buyer-listing/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/buyer-listing/schema/ListingWhereSchema";
import { CursorSchema } from "~/query/schema/CursorSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		where: ListingWhereSchema.optional().meta({
			id: "ListingWhere",
			description: "App-based filters",
		}),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
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
