import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "~/@buyer/listing/schema/ListingFilterSchema";
import { ListingQuerySchema } from "~/@buyer/listing/schema/ListingQuerySchema";
import { ListingWhereSchema } from "~/@buyer/listing/schema/ListingWhereSchema";

type FilterOverrideKeys = Partial<Record<keyof typeof ListingFilterSchema.shape, z.ZodType>>;

const FilterOverrideSchema = {
	expiresAtBefore: z.string().optional().openapi({
		description: "This filter matches listings that expire before the provided date",
	}),
	expiresAtAfter: z.string().optional().openapi({
		description: "This filter matches listings that expire after the provided date",
	}),
} satisfies FilterOverrideKeys;

export const ListingQueryMcpSchema = z
	.object({
		...ListingQuerySchema.shape,
		filter: z
			.object({
				...ListingFilterSchema.shape,
				...FilterOverrideSchema,
			})
			.optional(),
		where: z
			.object({
				...ListingWhereSchema.shape,
				...FilterOverrideSchema,
			})
			.optional(),
	})
	.describe(
		"Buyer listing query for MCP. Date-like filters are passed as strings and then parsed by the server.",
	);

export type ListingQueryMcpSchema = typeof ListingQueryMcpSchema;

export namespace ListingQueryMcpSchema {
	export type Type = z.infer<ListingQueryMcpSchema>;
}
