import { z } from "@hono/zod-openapi";

const SellerListingCountFilterMcpSchema = z
	.object({
		id: z.string().optional().describe("Exact listing id match."),
		idIn: z.array(z.string()).optional().describe("Any-of listing id match."),
		fulltext: z
			.string()
			.optional()
			.describe("Broad text search over seller-owned published listings."),
	})
	.describe("Public filter semantics for seller listing count.");

export const SellerListingCountQueryMcpSchema = z
	.object({
		filter: SellerListingCountFilterMcpSchema.optional(),
	})
	.describe("Seller listing count query over published seller-owned listings.");

export type SellerListingCountQueryMcpSchema = typeof SellerListingCountQueryMcpSchema;

export namespace SellerListingCountQueryMcpSchema {
	export type Type = z.infer<SellerListingCountQueryMcpSchema>;
}
