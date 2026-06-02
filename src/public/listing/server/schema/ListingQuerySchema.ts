import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { ListingMetaSchema } from "~/public/listing/server/schema/ListingMetaSchema";
import { ListingSortSchema } from "~/public/listing/server/schema/ListingSortSchema";
import { ListingWhereSchema } from "~/public/listing/server/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		where: ListingWhereSchema.optional(),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "PublicListingQuery",
		description: "Query object for public listing collection",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema {
	export type Type = z.infer<ListingQuerySchema>;
}
