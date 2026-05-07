import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { ListingSortSchema } from "~/buyer/listing/server/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/buyer/listing/server/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		filter: ListingWhereSchema.optional().meta({
			id: "ListingFilter",
			description: "User-land filters",
		}),
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
