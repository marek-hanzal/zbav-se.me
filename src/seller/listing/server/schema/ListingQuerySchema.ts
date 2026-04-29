import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { ListingSortSchema } from "~/seller/listing/server/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/seller/listing/server/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		//
		filter: ListingWhereSchema.optional(),
		where: ListingWhereSchema.optional(),
		//
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
